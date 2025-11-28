import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FilterModal = ({
  open,
  onClose,
  currentFilter,
  onFilterSelect,
  filterOptions = [],
}) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* 1. Backdrop (Click to close) */}
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* 2. The Popup Card (Centered) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative bg-white w-full max-w-xs rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-serif font-bold text-gray-900">Filter Collection</h2>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm border border-gray-100"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Options List */}
            <div className="p-5 max-h-[50vh] overflow-y-auto">
              <div className="flex flex-col gap-2">
                {filterOptions.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onFilterSelect(f.id);
                      onClose();
                    }}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border text-left flex justify-between items-center ${
                      currentFilter === f.id
                        ? 'bg-[#B08D55] text-white border-[#B08D55] shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#B08D55] hover:text-[#B08D55]'
                    }`}
                  >
                    {f.name}
                    {currentFilter === f.id && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase tracking-wider">Active</span>}
                  </button>
                ))}
              </div>
            </div>
              
            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
              <button 
                onClick={() => { onFilterSelect('All'); onClose(); }}
                className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-wider px-4"
              >
                Reset
              </button>
              <button 
                onClick={onClose}
                className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-black shadow-lg"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};