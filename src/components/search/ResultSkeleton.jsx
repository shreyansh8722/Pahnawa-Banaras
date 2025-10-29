import React from "react";

export const ResultSkeleton = () => (
  <div className="flex flex-col gap-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex gap-4 p-3 -m-3 animate-pulse"> {/* Matched ResultRow padding */}
        <div className="w-16 h-16 bg-gray-200/60 rounded-xl flex-shrink-0" /> {/* Matched ResultRow image size & bg */}
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-200/60 rounded w-3/4" />
          <div className="h-3 bg-gray-200/60 rounded w-1/2" />
          <div className="h-3 bg-gray-200/60 rounded w-1/4" />
        </div>
      </div>
    ))}
  </div>
);