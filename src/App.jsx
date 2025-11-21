import { useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatArea from "./components/ChatArea";
import ChatInput from "./components/ChatInput";
import { supabase } from "./supabaseClient";

function App() {
  const [messages, setMessages] = useState([]);

  // Generate a unique id
  const uuid = () => crypto.randomUUID();

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

    // Show messages immediately
    setMessages((prev) => [...prev, newUserMessage, tempBot]);

    // Save user message to Supabase
    const { error: insertErrorUser } = await supabase.from("messages").insert([
      {
        id: newUserMessage.id,
        sender: newUserMessage.sender,
        text: newUserMessage.text,
        created_at: new Date().toISOString(),
      },
    ]);
    if (insertErrorUser) console.error("Supabase insert error (user):", insertErrorUser);

    try {
      // Call your Edge Function
      const response = await fetch(
        "https://arkhusjvmkzhilelhdmu.supabase.co/functions/v1/chatbot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [newUserMessage].map((m) => ({
              role: m.sender === "user" ? "user" : "model",
              content: m.text,
            })),
          }),
        }
      );

      const data = await response.json();
      const botReply = data.reply || "No reply";

      // Update placeholder bot message
      setMessages((prev) =>
        prev.map((m) => (m.id === tempBot.id ? { ...m, text: botReply } : m))
      );

      // Save bot reply to Supabase
      const { error: insertErrorBot } = await supabase.from("messages").insert([
        {
          id: tempBot.id,
          sender: tempBot.sender,
          text: botReply,
          created_at: new Date().toISOString(),
        },
      ]);
      if (insertErrorBot) console.error("Supabase insert error (bot):", insertErrorBot);
    } catch (err) {
      console.error("Failed to call Edge Function:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempBot.id
            ? { ...m, text: "⚠ Failed to reach server" }
            : m
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
