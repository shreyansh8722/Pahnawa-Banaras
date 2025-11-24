// src/components/SkeletonCard.jsx
import React from "react";

export const SkeletonCard = () => (
  // --- THE FIX: Reverted to original, smaller dimensions ---
  <div className="w-[160px] h-[220px] bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse flex-shrink-0" />
);