import React, { useState } from "react";
import { AiOutlineSend, AiOutlineCopy } from "react-icons/ai";
import { FiToggleRight } from "react-icons/fi";

const ChatBox = ({ onShowGraph, onNewMessage, currentGraph, messages }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() === "") return;
    onNewMessage(inputValue); // Add user message and default AI response
    setInputValue(""); // Clear the input box
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text); // Copy text to clipboard
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 p-4 shadow-md">
        <h1 className="text-lg font-semibold">AI Chat</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(({ id, text, sender, timestamp }) => (
          <div
            key={id}
            className={`group flex ${
              sender === "user" ? "justify-end" : "justify-start"
            } animate-slide-in`}
          >
            <div
              className={`relative max-w-[70%] p-4 rounded-xl shadow ${
                sender === "user"
                  ? "bg-gray-700 text-white rounded-tr-none"
                  : "bg-gray-800 text-gray-300 rounded-tl-none"
              }`}
            >
              <p className="text-sm">{text}</p>
              <div className="mt-1 text-xs opacity-70 flex justify-between items-center">
                <span>{timestamp}</span>
                {sender === "ai" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onShowGraph(id)}
                      className={`p-2 rounded-full ${
                        currentGraph === id ? "bg-gray-500" : ""
                      } hover:bg-gray-500 transition-transform transform hover:scale-80`}
                      title="Show Thought Graph"
                    >
                      <FiToggleRight size={13} />
                    </button>
                    <button
                      onClick={() => handleCopy(text)}
                      className="p-2 rounded-full hover:bg-gray-500 transition-transform transform hover:scale-110"
                      title="Copy"
                    >
                      <AiOutlineCopy size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-gray-800 p-4 flex items-center space-x-3">
        <input
          type="text"
          className="flex-1 bg-gray-700 text-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-transform transform hover:scale-110"
          title="Send Message"
        >
          <AiOutlineSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
