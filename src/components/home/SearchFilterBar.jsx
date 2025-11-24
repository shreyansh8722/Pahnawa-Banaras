import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export const SearchFilterBar = ({
  searchQuery,
  onSearchChange,
  onFilterClick,
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* Search Input */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search spots, food, shops..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full py-3 pl-11 pr-4 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
        />
      </div>
      {/* Filter Button */}
      <button
        onClick={onFilterClick}
        className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label="Open filters"
      >
        <SlidersHorizontal size={16} />
      </button>
    </div>
  );
};
