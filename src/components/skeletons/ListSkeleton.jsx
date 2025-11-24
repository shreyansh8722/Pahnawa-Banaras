import React from 'react';

const ListSkeleton = ({ itemCount = 3 }) => (
  <div className="space-y-4 animate-pulse">
    {[...Array(itemCount)].map((_, i) => (
      <div
        key={i}
        className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex gap-4 dark:bg-gray-800 dark:border-gray-700 relative"
      >
        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-xl flex-shrink-0"></div>
        <div className="flex-grow space-y-3 py-2">
          <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

export default ListSkeleton;