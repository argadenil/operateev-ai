"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hello 👋 How can I help you today?" },
    { id: 2, sender: "user", text: "I just wanted to check system status." },
    { id: 3, sender: "bot", text: "System is running smoothly ✅" },
    { id: 4, sender: "user", text: "Great! Can I see today’s activity logs?" },
    { id: 5, sender: "bot", text: "Sure! Fetching logs for you... 📊" },
    { id: 6, sender: "bot", text: "Logs show no errors, only routine checks." },
    { id: 7, sender: "user", text: "Perfect, thanks!" },
    { id: 8, sender: "bot", text: "Anytime 🚀" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      sender: "user" as const,
      text: input,
    };
    setMessages([...messages, newMessage]);
    setInput("");

    // Dummy bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "bot" as const,
          text: "🤖 Got it! This is a dummy reply.",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white border rounded-xl shadow-lg">
      {/* Chat header */}
      <div className="p-4 border-b bg-indigo-600 text-white font-semibold rounded-t-xl">
        Chat Assistant
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl shadow-sm max-w-xs sm:max-w-sm md:max-w-md break-words ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="p-3 border-t flex items-center space-x-2 bg-white rounded-b-xl">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
