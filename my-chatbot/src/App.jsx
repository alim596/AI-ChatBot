import React, { useState, useRef } from "react";
import ChatBox from "./components/ChatBox";
import ThoughtGraph from "./components/ThoughtGraph";
import { mockdata } from "./data/mockData";

const App = () => {
  const [messages, setMessages] = useState(mockdata);
  const [currentGraph, setCurrentGraph] = useState(null);
  const [chatWidth, setChatWidth] = useState(100); // ChatBox width in percentage

  const isResizing = useRef(false); // Track whether resizing is active
  const lastChatWidth = useRef(chatWidth); // Store last valid chatWidth
  const dividerRef = useRef(); // Divider reference for positioning

  const handleToggleGraph = (id) => {
    setCurrentGraph((prev) => (prev === id ? null : id));
    if (currentGraph === id) setChatWidth(100); // Reset to full width when CoT is closed
    else setChatWidth(50); // Split into half
  };

  const handleNewMessage = (text) => {
    const userMessage = {
      id: messages.length + 1,
      text,
      sender: "user",
      timestamp: new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date()),
    };

    const aiResponse = {
      id: messages.length + 2,
      text: "This is a default AI response.",
      sender: "ai",
      timestamp: new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date()),
      reasoning: [
        { id: 1, title: "Default Step 1", details: "Default reasoning details for step 1." },
        { id: 2, title: "Default Step 2", details: "Default reasoning details for step 2." },
      ],
    };

    setMessages((prev) => [...prev, userMessage, aiResponse]);
    setCurrentGraph(null);
    setChatWidth(100);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;

    // Calculate new width based on cursor position
    const newChatWidth = (e.clientX / window.innerWidth) * 100;
    if (newChatWidth >= 20 && newChatWidth <= 80) {
      dividerRef.current.style.left = `${newChatWidth}%`; // Update divider dynamically
      lastChatWidth.current = newChatWidth; // Save the last valid width
    }
  };

  const handleMouseUp = () => {
    if (!isResizing.current) return;
    isResizing.current = false;
    setChatWidth(lastChatWidth.current); // Finalize width state
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = () => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="h-screen w-screen flex bg-gray-900 text-gray-100 relative">
      {/* ChatBox */}
      <div
        className="flex-none transition-all duration-500 ease-in-out"
        style={{ width: `${chatWidth}%` }}
      >
        <ChatBox
          onShowGraph={handleToggleGraph}
          onNewMessage={handleNewMessage}
          currentGraph={currentGraph}
          messages={messages}
        />
      </div>

      {/* Divider */}
      {currentGraph && (
        <div
          ref={dividerRef}
          className="absolute top-0 h-full w-2 bg-gray-700 cursor-col-resize z-50"
          style={{ left: `${chatWidth}%` }}
          onMouseDown={handleMouseDown}
        ></div>
      )}

      {/* Thought Graph */}
      {currentGraph && (
        <div
          className="flex-none transition-all duration-500 ease-in-out bg-gray-800 overflow-hidden"
          style={{ width: `${100 - chatWidth}%` }}
        >
          <ThoughtGraph
            reasoning={messages.find((msg) => msg.id === currentGraph).reasoning || []}
          />
        </div>
      )}
    </div>
  );
};

export default App;
