import ChatHeader from "./components/ChatHeader";
import ChatArea from "./components/ChatArea";
import ChatInput from "./components/ChatInput";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient"; // make sure VITE keys are set

function App() {
  const [messages, setMessages] = useState([]);
  const uuid = () => crypto.randomUUID();

  // Load messages from Supabase on mount
  useEffect(() => {
    async function loadMessages() {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Supabase fetch error:", error);
        return;
      }

      const loadedMessages = data.map((m) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        time: new Date(m.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setMessages(loadedMessages);
    }

    loadMessages();
  }, []);

  // Save a message to Supabase
  async function saveMessageToDB(message) {
    const { data, error } = await supabase.from("messages").insert([
      {
        id: message.id,
        sender: message.sender,
        text: message.text,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) console.error("Supabase insert error:", error);
  }

  // Handle sending messages
  async function handleSend(text) {
    if (!text.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newUserMessage = {
      id: uuid(),
      sender: "user",
      text,
      time: currentTime,
    };

    const tempBot = {
      id: uuid(),
      sender: "bot",
      text: "typing…",
      time: currentTime,
    };

    // Add user and placeholder bot message
    setMessages((prev) => [...prev, newUserMessage, tempBot]);

    // Save user message
    saveMessageToDB(newUserMessage);

    try {
      const response = await fetch(
        "https://arkhusjvmkzhilelhdmu.supabase.co/functions/v1/chatbot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [newUserMessage, ...messages].map((m) => ({
              role: m.sender === "user" ? "user" : "model",
              content: m.text,
            })),
          }),
        }
      );

      const data = await response.json();
      const botReply = data.reply || "No reply";

      // Replace placeholder with real bot reply
      setMessages((prev) =>
        prev.map((m) => (m.id === tempBot.id ? { ...m, text: botReply } : m))
      );

      // Save bot reply
      saveMessageToDB({ ...tempBot, text: botReply });
    } catch (err) {
      console.error("Failed to call Edge Function:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempBot.id ? { ...m, text: "⚠ Failed to reach server" } : m
        )
      );
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <ChatHeader />
      <ChatArea messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}

export default App;



