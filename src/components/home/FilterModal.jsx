import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Hardcoded filter options as seen in original code
// (You can move this back to ../utils/filters if you prefer)
const FILTER_OPTIONS = [
    { id: "All", label: "All" },
    { id: "free", label: "Free" },
    { id: "new", label: "New" },
    { id: "top", label: "Top Rated" },
];

export const FilterModal = ({ open, onClose, currentFilter, onFilterSelect }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end"
          onClick={onClose} // Close when clicking backdrop
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal
            className="w-full max-w-md bg-[#0b0b0c] rounded-t-[28px] shadow-2xl p-6 pb-8 border-t border-white/6"
          >
            <div className="w-10 h-1.5 bg-gray-800 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-100">Filters</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-200" aria-label="Close filters">
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {FILTER_OPTIONS.map((f) => (
                <motion.button
                  key={f.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onFilterSelect(f.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    currentFilter === f.id ? "bg-blue-600 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {f.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
