import React from "react";
import { X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CitySheet = ({ open, onClose, cities, selectedCity, onCitySelect }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close when clicking backdrop
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50"
        >
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.28 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking sheet
            className="bg-[#0b0b0c] w-full max-w-md rounded-t-3xl p-6 pb-24 shadow-xl border-t border-white/8"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Choose Destination</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close city selection">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {cities.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCitySelect(c.name)}
                  className={`w-full px-4 py-3 rounded-xl flex items-center justify-between transition ${
                    c.name === selectedCity ? "bg-blue-600 text-white" : "hover:bg-white/6 text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.thumbnail || c.heroImageUrl || c.hero}
                      alt={c.name}
                      className="w-12 h-8 object-cover rounded-md"
                      loading="lazy"
                    />
                    <div className="flex flex-col leading-tight text-left">
                      <span className="font-medium">{c.name}</span>
                      {c.subtitle && <span className="text-xs text-gray-300/70">{c.subtitle}</span>}
                    </div>
                  </div>
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
