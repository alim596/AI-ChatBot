import React, { useState } from "react";

const ThoughtGraph = ({ reasoning }) => {
  const [expandedNodes, setExpandedNodes] = useState([]);

  const toggleNode = (id) => {
    setExpandedNodes((prev) =>
      prev.includes(id) ? prev.filter((nodeId) => nodeId !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col items-start w-full h-full p-4">
      <h2 className="text-xl font-semibold text-white m-4">Chain of Thought</h2>
      <div className="flex flex-col space-y-4 w-full p-4">
        {reasoning.map(({ id, title, details }) => (
          <div
            key={id}
            className="relative bg-gray-700 p-4 rounded-lg shadow cursor-pointer transition-all transform hover:scale-105"
          >
            {/* Node Header */}
            <div
              className="flex justify-between items-center"
              onClick={() => toggleNode(id)}
            >
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <span className="text-xs text-gray-300">
                {expandedNodes.includes(id) ? "Hide" : "Expand"}
              </span>
            </div>

            {/* Node Details */}
            {expandedNodes.includes(id) && (
              <p className="mt-2 text-sm text-gray-300 animate-fade-in">{details}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThoughtGraph;
