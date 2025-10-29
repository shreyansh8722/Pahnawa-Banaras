// src/components/SkeletonCard.jsx
import React from "react";

export const SkeletonCard = () => (
  /* 💡 THE FIX: 
    REMOVED 'mx-1' to match the updated SpotCard.
  */
  <div className="w-[160px] h-[220px] bg-gray-800/40 rounded-3xl animate-pulse flex-shrink-0" />
);

