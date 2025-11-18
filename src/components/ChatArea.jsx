import { useEffect, useRef } from "react";

function ChatArea({ messages }) {
  const bottomRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`mb-3 flex flex-col ${
            msg.sender === "user" ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`inline-block p-2 rounded-lg shadow max-w-xs break-words
              ${msg.sender === "user"
                ? "bg-indigo-200 text-indigo-900"
                : "bg-gray-200 text-gray-900"
              }`}
          >
            {msg.text}
          </div>
          <span className="text-xs text-gray-500 mt-1">
            {msg.time}
          </span>
        </div>
      ))}
      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatArea;
