"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import Image from "next/image";

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hello 👋 How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Set current time after component mounts to avoid hydration mismatch
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = {
      id: messages.length + 1,
      sender: "user" as const,
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    const prompt = input;
    setInput("");
    setIsProcessing(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        throw new Error("Failed to get response from AI backend");
      }
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "bot" as const,
          text: data.response || "(No response)"
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "bot" as const,
          text: "Sorry, I couldn't get a response from the server."
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh] bg-gradient-to-br from-indigo-50/40 via-white/60 to-purple-50/40 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <div className="font-semibold">AI Assistant</div>
            <div className="text-sm text-white/80">Always here to help</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-white/80">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-white/70 via-indigo-50/40 to-purple-50/40 backdrop-blur-md">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* Bot Avatar */}
            {msg.sender === "bot" && (
              <div className="w-8 h-8 flex-shrink-0 mr-3 mb-1">
                <Image
                  src="/images/robot.png"
                  alt="AI Avatar"
                  width={40}
                  height={40}
                  className="w-full h-full rounded-2xl shadow-md object-cover ring-2 ring-indigo-100"
                />
              </div>
            )}

            {/* Chat bubble with modern styling */}
            <div
              className={`relative px-6 py-4 max-w-xs sm:max-w-sm md:max-w-md break-words shadow-lg transition-all duration-300 hover:shadow-xl ${msg.sender === "user"
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl rounded-br-lg"
                  : "bg-gradient-to-br from-cyan-600 to-teal-700 text-white rounded-3xl rounded-bl-lg border border-cyan-500"
                }`}
            >
              <div className={`text-sm leading-relaxed ${msg.sender === "user" ? "text-white" : "text-white"}`}>
                {msg.text}
              </div>

              {/* Message timestamp */}
              <div className={`text-xs mt-2 ${msg.sender === "user" ? "text-white/70" : "text-white/70"}`}>
                {currentTime || '--:--'}
              </div>
            </div>

            {/* User Avatar */}
            {msg.sender === "user" && (
              <div className="w-10 h-10 flex-shrink-0 ml-3 mb-1">
                <div className="w-full h-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  N
                </div>
              </div>
            )}
          </div>
        ))}
        {/* Processing indicator */}
        {isProcessing && (
          <div className="flex items-end justify-start space-x-3">
            {/* AI Avatar */}
            <div className="w-10 h-10 flex-shrink-0">
              <Image
                src="/images/robot.png"
                alt="AI Avatar"
                width={40}
                height={40}
                className="rounded-2xl shadow-md object-cover ring-2 ring-indigo-100"
              />
            </div>

            {/* Processing Message */}
            <div className="relative px-5 py-3 max-w-xs sm:max-w-sm md:max-w-md break-words shadow-lg bg-white text-gray-800 rounded-3xl rounded-bl-lg border border-gray-100 animate-pulse">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <span className="w-3 h-3 rounded-full bg-cyan-600 animate-bounce" />
                <span>Processing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200/60 bg-gradient-to-r from-white/90 via-indigo-50/30 to-purple-50/30 backdrop-blur-md">
        <div className="relative flex items-center space-x-3">
          <div className="relative flex-grow">
            <label htmlFor="chat-input" className="sr-only">
              Type your message
            </label>
            <input
              id="chat-input"
              type="text"
              placeholder="Type your message..."
              className="w-full px-5 py-4 pl-12 border border-gray-200/80 rounded-2xl shadow-sm bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              aria-describedby="chat-input-description"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
              💬
            </div>
            <div id="chat-input-description" className="sr-only">
              Press Enter to send your message
            </div>
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            aria-label="Send message"
          >
            <Send size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
