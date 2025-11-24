import React from 'react';

const GridSkeleton = ({ itemCount = 4 }) => (
  <div className="grid grid-cols-2 gap-4 animate-pulse">
    {[...Array(itemCount)].map((_, i) => (
      <div key={i} className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
    ))}
  </div>
);

export default GridSkeleton;