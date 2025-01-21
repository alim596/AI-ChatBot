import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown"; // For Markdown rendering
import { AiOutlineSend, AiOutlineCopy } from "react-icons/ai";
import { FiToggleRight, FiLoader } from "react-icons/fi"; // Loading spinner icon
import TypingAnimation from "./TypingAnimation"; // Keeps your typing animation intact

// Mock Observability Data
const mockObservabilityData = `
Observability Alert Data:
- Service: Authentication Service
  - CPU Usage: 92% (Threshold: 80%)
  - Memory Usage: 1.9 GB (Threshold: 1.5 GB)
- Service: Payment Gateway
  - Error Rate: 12% (Threshold: 5%)
  - Latency: 1200ms (Threshold: 800ms)
`;

const ChatBox = ({ messages, currentGraph, onShowGraph, onNewMessage, loading }) => {
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to the bottom on new messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Check for the trigger keyword
    if (inputValue.toLowerCase().includes("check observability")) {
      // Feed the mock observability data instead of the user's text
      onNewMessage(mockObservabilityData);
    } else {
      // Normal message handling
      onNewMessage(inputValue);
    }

    setInputValue("");
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
    }
  };
  
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-[#0f0f0f] text-gray-200">
      {/* Messages Section */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map(({ id, sender, text }) => (
          <div
            key={id}
            className={`flex ${
              sender === "user" ? "justify-end" : "justify-center"
            }`}
          >
            {sender === "user" ? (
              <div className="bg-[#2c2c2c] p-4 rounded-2xl text-sm max-w-[75%] shadow">
                {text}
              </div>
            ) : (
              <div className="bg-transparent max-w-3xl p-4 prose prose-invert mr-6">
                <ReactMarkdown>{text}</ReactMarkdown>
                <div className="mt-2 flex justify-between text-gray-400 text-xs">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onShowGraph(id)}
                      title="Show Thought Graph"
                      className={`p-1 rounded-full hover:bg-gray-600 transition ${
                        currentGraph === id ? "bg-gray-600" : ""
                      }`}
                    >
                      <FiToggleRight size={16} />
                    </button>
                    <button
                      onClick={() => handleCopy(text)}
                      title="Copy"
                      className="p-1 rounded-full hover:bg-gray-600 transition"
                    >
                      <AiOutlineCopy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Animation */}
        {loading && (
          <div className="flex justify-center">
            <div className="p-4">
              <TypingAnimation />
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="bg-[#1a1a1a] border-t border-gray-700 p-4">
        <div className="flex max-w-3xl mx-auto space-x-2">
          <textarea
            ref={textAreaRef}
            rows={1}
            className="flex-1 bg-transparent text-gray-200 border border-gray-600 rounded-full px-4 py-2
                       focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none
                       whitespace-pre-wrap break-words leading-snug
                       scrollbar-thin scrollbar-track-gray-600 scrollbar-thumb-gray-500"
              placeholder="Type your message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            className={`p-3 rounded-full transition ${
              loading
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
            disabled={loading} // Disable button while loading
          >
            {loading ? <FiLoader className="animate-spin" size={18} /> : <AiOutlineSend size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
