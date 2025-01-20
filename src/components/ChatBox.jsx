import React, { useState, useRef, useEffect } from "react";
import { AiOutlineSend, AiOutlineCopy } from "react-icons/ai";
import { FiToggleRight } from "react-icons/fi";
import TypingAnimation from "./TypingAnimation";

const ChatBox = ({ messages, currentGraph, onShowGraph, onNewMessage, loading }) => {
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Auto-resize the textarea
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onNewMessage(inputValue);
    setInputValue("");
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    // We'll make this container also "overflow-hidden" & "flex-col"
    // so we can independently scroll only the message list.
    <div className="relative flex flex-col h-full overflow-hidden">

      {/* Messages list (independent scroll) */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map(({ id, sender, text, timestamp }) => {
          const isUser = sender === "user";
          return (
            <div
              key={id}
              className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  relative max-w-[75%] p-4 rounded-2xl shadow
                  whitespace-pre-wrap break-words
                  ${
                    isUser
                      ? "bg-[#2c2c2c] text-gray-200"
                      : "bg-[#1f1f1f] text-gray-200"
                  }
                `}
              >
                <p className="text-sm leading-snug">{text}</p>
                <div className="mt-1 text-xs flex justify-between items-center space-x-2 text-gray-400">
                  <span>{timestamp}</span>
                  {!isUser && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onShowGraph(id)}
                        title="Show Thought Graph"
                        className={`p-1 rounded-full hover:bg-gray-600 transition ${
                          currentGraph === id ? "bg-gray-600" : ""
                        }`}
                      >
                        <FiToggleRight size={13} />
                      </button>
                      <button
                        onClick={() => handleCopy(text)}
                        title="Copy"
                        className="p-1 rounded-full hover:bg-gray-600 transition"
                      >
                        <AiOutlineCopy size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex w-full justify-start">
            <div className="relative max-w-[75%] p-4 rounded-2xl shadow bg-[#1f1f1f] text-gray-200">
              <TypingAnimation /> {/* Show typing animation */}
            </div>
          </div>
        )}
      </div>
      {/* Input bar pinned to the bottom inside ChatBox */}
      <div className="bg-[#0f0f0f] border-t border-gray-700 p-4">
        <div className="max-w-3xl mx-auto flex space-x-2">
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
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors flex-shrink-0"
          >
            <AiOutlineSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
