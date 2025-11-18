import { Send } from "lucide-react";
import { useState } from "react";

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  function handleSendClick() {
    if (!input) return;
    onSend(input);
    setInput("");
  }
  function handleKeyDown(e) {
    // Enter = send message
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  }

  return (
    <div className="flex items-center gap-2 p-4 bg-white border border-gray-300">
      {/* text input */}
      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow gap-2 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1"
      />

      {/* send button */}
      <button
        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow px-4 p-2"
        onClick={handleSendClick}
      >
        <Send size={23} />
      </button>
    </div>
  );
}

export default ChatInput;
