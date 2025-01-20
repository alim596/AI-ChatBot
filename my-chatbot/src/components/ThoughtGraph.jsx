import React, { useState } from "react";

const ThoughtGraph = ({ reasoning }) => {
  const [expandedNodes, setExpandedNodes] = useState([]);

  const toggleNode = (id) => {
    setExpandedNodes((prev) =>
      prev.includes(id)
        ? prev.filter((nodeId) => nodeId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col w-full p-4">
      <h2 className="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">
        Chain of Thought
      </h2>
      <div className="space-y-4">
        {reasoning.map(({ id, title, details }) => (
          <div
            key={id}
            className="bg-[#2c2c2c] p-4 rounded-lg shadow cursor-pointer hover:bg-[#3a3a3a] transition"
            onClick={() => toggleNode(id)}
          >
            {console.log(id)}
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-200">{title}</h3>
              <span className="text-xs text-gray-300">
                {expandedNodes.includes(id) ? "Hide" : "Expand"}
              </span>
            </div>
            {expandedNodes.includes(id) && (
              <p className="mt-2 text-sm text-gray-300 whitespace-pre-wrap break-words">
                {details}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThoughtGraph;
