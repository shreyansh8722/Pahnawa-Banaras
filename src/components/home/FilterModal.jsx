import React from 'react';
import { X } from 'lucide-react';
// --- REMOVED motion, AnimatePresence ---

export const FilterModal = ({
  open,
  onClose,
  currentFilter,
  onFilterSelect,
  filterOptions = [], // Accept filters as a prop
}) => {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end"
      onClick={onClose} // Close when clicking backdrop
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-[28px] shadow-2xl p-6 pb-8 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="w-10 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Filters
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
            aria-label="Close filters"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {filterOptions.map((f) => (
            <button // --- REMOVED motion.button ---
              key={f.id}
              onClick={() => onFilterSelect(f.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                currentFilter === f.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f.icon}
              {f.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};