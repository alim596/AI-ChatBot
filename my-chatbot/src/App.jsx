import React, { useState, useRef, useEffect } from "react";
import ChatBox from "./components/ChatBox";
import ThoughtGraph from "./components/ThoughtGraph";
import { mockdata } from "./data/mockData";

const App = () => {
  const [messages, setMessages] = useState(mockdata);
  const [currentGraph, setCurrentGraph] = useState(null);
  const [chatWidth, setChatWidth] = useState(100); // 100% by default (no CoT)
  const [conversationTitle, setConversationTitle] = useState("New Conversation");

  const isResizing = useRef(false);
  const lastChatWidth = useRef(chatWidth);
  const dividerRef = useRef();

  /**
   * Generate conversation title from the first user message
   */
  useEffect(() => {
    const firstUserMsg = messages.find((m) => m.sender === "user");
    if (firstUserMsg) {
      const truncated =
        firstUserMsg.text.length > 60
          ? firstUserMsg.text.slice(0, 60) + "..."
          : firstUserMsg.text;
      setConversationTitle(truncated);
    } else {
      setConversationTitle("New Conversation");
    }
  }, [messages]);

  /**
   * Toggle the chain-of-thought panel
   */
  const handleToggleGraph = (messageId) => {
    setCurrentGraph((prev) => (prev === messageId ? null : messageId));
    if (currentGraph === messageId) {
      // If the same message is clicked again, close the panel
      setChatWidth(100);
    } else {
      // Open CoT at ~half the screen
      setChatWidth(50);
    }
  };

  /**
   * Create a new user message and mock AI response
   */
  const handleNewMessage = (text) => {
    const userMsg = {
      id: messages.length + 1,
      text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    // Mock AI Response (replace with your ChatGPT API call)
    const aiMsg = {
      id: messages.length + 2,
      text: "AI Response (replace with real API call)",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      reasoning: [
        { id: 1, title: "Step 1", details: "Reasoning details for step 1." },
        { id: 2, title: "Step 2", details: "Reasoning details for step 2." },
      ],
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    // Close CoT if open
    setCurrentGraph(null);
    setChatWidth(100);
  };

  /**
   * Divider resizing logic
   */
  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth >= 20 && newWidth <= 80) {
      // Move the divider visually
      dividerRef.current.style.left = `${newWidth}%`;
      // Track it so we can finalize on mouseUp
      lastChatWidth.current = newWidth;
    }
  };

  const handleMouseUp = () => {
    if (!isResizing.current) return;
    isResizing.current = false;
    setChatWidth(lastChatWidth.current);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = () => {
    // Only resize if CoT is open
    if (!currentGraph) return;
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    // No global scrolling => each panel scrolls independently
    <div className="h-screen w-screen flex flex-col bg-[#0f0f0f] text-gray-200 overflow-hidden">

      {/* Sticky header */}
      <header className="bg-[#1a1a1a] p-4 border-b border-gray-700 sticky top-0 z-50">
        <h1 className="text-xl font-semibold truncate">{conversationTitle}</h1>
      </header>

      {/* Main area: Chat on the left + optional CoT on the right */}
      {/* We use "overflow-hidden" here so only child panels scroll, not the entire page. */}
      <div className="flex flex-1 relative overflow-hidden">

        {/* Chat section */}
        <div
          className="flex-none transition-all duration-500 ease-in-out"
          style={{ width: `${chatWidth}%` }}
        >
          <ChatBox
            messages={messages}
            currentGraph={currentGraph}
            onShowGraph={handleToggleGraph}
            onNewMessage={handleNewMessage}
          />
        </div>

        {/* Divider (appears only if CoT is open) */}
        {currentGraph && (
          <div
            ref={dividerRef}
            className="absolute top-0 bottom-0 w-2 bg-[#2b2b2b] cursor-col-resize z-40 hover:bg-[#404040]"
            style={{ left: `${chatWidth}%` }}
            onMouseDown={handleMouseDown}
          />
        )}

        {/* CoT section */}
        {currentGraph && (
          <div
            // "overflow-y-auto" => its own scroll
            className="flex-none transition-all duration-500 ease-in-out bg-[#1a1a1a] overflow-y-auto h-full z-30"
            style={{ width: `${100 - chatWidth}%` }}
          >
            <ThoughtGraph
              reasoning={
                messages.find((msg) => msg.id === currentGraph)?.reasoning || []
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
