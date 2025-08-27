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
    { id: 9, sender: "user", text: "Can you summarize yesterday’s performance?" },
    { id: 10, sender: "bot", text: "Yesterday was stable with all systems nominal." },
    { id: 11, sender: "user", text: "What about server CPU usage?" },
    { id: 12, sender: "bot", text: "Average CPU usage was 42%, within safe limits." },
    { id: 13, sender: "user", text: "Any errors reported by the database?" },
    { id: 14, sender: "bot", text: "No errors. All database queries executed successfully." },
    { id: 15, sender: "user", text: "How many users logged in yesterday?" },
    { id: 16, sender: "bot", text: "Total active users: 1,234 👥" },
    { id: 17, sender: "user", text: "Can you check the last deployment status?" },
    { id: 18, sender: "bot", text: "Last deployment completed successfully without downtime." },
    { id: 19, sender: "user", text: "Any pending system alerts?" },
    { id: 20, sender: "bot", text: "No pending alerts. All systems operational ✅" },
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* AI Avatar */}
            {msg.sender === "bot" && (
              <img
                src="/images/robot.png" // Robot icon
                alt="AI Avatar"
                className="w-10 h-10 flex-shrink-0 rounded-full mr-3 shadow-md object-cover"
              />
            )}

            {/* Chat bubble */}
            <div
              className={`px-5 py-3 rounded-2xl max-w-xs sm:max-w-sm md:max-w-md break-words shadow transition transform hover:scale-[1.02] ${
                msg.sender === "user"
                  ? "bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-br-none"
                  : "bg-gradient-to-tr from-gray-200 to-gray-300 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>

            {/* User Avatar */}
            {msg.sender === "user" && (
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png" // User icon
                alt="User Avatar"
                className="w-10 h-10 flex-shrink-0 rounded-full ml-3 shadow-md object-cover"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="p-3 border-t flex items-center space-x-2 bg-white rounded-b-xl">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition transform hover:scale-110"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
