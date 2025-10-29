import React from "react";

export const TrendingSkeleton = () => (
  <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1 -mx-1"> {/* Adjusted margin */}
    {[...Array(3)].map((_, i) => (
      <div key={i} className="w-64 h-64 bg-gray-200/60 rounded-2xl animate-pulse flex-shrink-0" /> 
    ))}
  </div>
);