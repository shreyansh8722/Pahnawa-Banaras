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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[20px] shadow-2xl md:bottom-auto md:top-1/2 md:left-1/2 md:w-full md:max-w-md md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl"
          >
            <div className="p-6 pb-8">
              {/* Mobile Pull Bar */}
              <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:hidden" />
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-serif font-bold text-gray-900">Filter Collection</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {filterOptions.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onFilterSelect(f.id);
                      onClose();
                    }}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                      currentFilter === f.id
                        ? 'bg-[#B08D55] text-white border-[#B08D55] shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#B08D55] hover:text-[#B08D55]'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                <button 
                  onClick={() => { onFilterSelect('All'); onClose(); }}
                  className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-wider"
                >
                  Clear All
                </button>
                <button 
                  onClick={onClose}
                  className="bg-black text-white px-8 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-gray-800"
                >
                  View Results
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};