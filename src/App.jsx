import React, { useState, useRef, useEffect } from "react";
import ChatBox from "./components/ChatBox";
import ThoughtGraph from "./components/ThoughtGraph";
import { BiReset } from "react-icons/bi";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [currentGraph, setCurrentGraph] = useState(null);
  const [chatWidth, setChatWidth] = useState(100);
  const [conversationTitle, setConversationTitle] = useState("New Conversation");
  const [loading, setLoading] = useState(false); // New loading state

  const isResizing = useRef(false);
  const lastChatWidth = useRef(chatWidth);
  const dividerRef = useRef();


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
      setChatWidth(100);
    } else {
      setChatWidth(60);
    }
  };

  /**
   * Handle new user message, call the backend for AI response
   */
  const handleNewMessage = async (text) => {
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

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true); // Start loading

    try {
      const resp = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await resp.json(); // { text, reasoning }

      const aiMsg = {
        id: userMsg.id + 1,
        text: data.text,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        reasoning: data.reasoning || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = {
        id: userMsg.id + 1,
        text: `Error connecting to backend: ${error.message}`,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        reasoning: [],
      };
      setMessages((prev) => [...prev, errorMsg]);
    }  finally {
      setLoading(false); 
    }

    setCurrentGraph(null);
    setChatWidth(100);
  };

  /**
   * Divider resizing logic
   */
  const handleMouseMove = (e) => {
    if (!isResizing.current) return;

    // Calculate the new width as a percentage of the window width
    const newWidth = (e.clientX / window.innerWidth) * 100;

    // Enforce minimum and maximum width limits (20% to 80%)
    if (newWidth >= 20 && newWidth <= 80) {
      dividerRef.current.style.left = `${newWidth}%`;
      lastChatWidth.current = newWidth; // Store the latest width
    }
  };

  const handleMouseUp = () => {
    if (!isResizing.current) return;

    isResizing.current = false; // Stop resizing
    setChatWidth(lastChatWidth.current); // Apply the final width

    // Remove event listeners for mouse move and mouse up
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = () => {
    if (!currentGraph) return;

    isResizing.current = true; // Start resizing

    // Add event listeners for mouse move and mouse up
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  /*
  * Reset chat context and frontend messages
  */
  const handleResetContext = async () => {
    try {
      // Call the backend reset endpoint
      const response = await fetch("http://127.0.0.1:8000/reset", { method: "POST" });
      if (response.ok) {
        // Clear the messages state to reset the frontend
        setMessages([]);
      } else {
        console.error("Failed to reset backend context:", response.statusText);
      }
    } catch (error) {
      console.error("Error resetting context:", error);
    }
  };
  
  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f0f0f] text-gray-200 overflow-hidden">
      {/* Header with reset button */}
      <header className="bg-[#1a1a1a] p-4 border-none sticky top-0 z-50 flex justify-between items-center">
        <h1 className="text-xl font-semibold truncate">Chat</h1>
        <button
          onClick={handleResetContext}
          className="p-2 bg-black-600 text-white rounded-full hover:bg-gray-600 transition"
          title="Reset Conversation"
        >
          <BiReset size={20} />
        </button>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        <div
          className="flex-none transition-all duration-500 ease-in-out"
          style={{ width: `${chatWidth}%` }}
        >
          <ChatBox
            messages={messages}
            currentGraph={currentGraph}
            onShowGraph={handleToggleGraph}
            onNewMessage={handleNewMessage}
            loading={loading}
          />
        </div>

        {currentGraph && (
          <div
            ref={dividerRef}
            className="absolute top-0 bottom-0 w-2 bg-[#2b2b2b] cursor-col-resize z-40 hover:bg-[#404040]"
            style={{ left: `${chatWidth}%` }}
            onMouseDown={handleMouseDown}
          />
        )}

        {currentGraph && (
          <div
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
