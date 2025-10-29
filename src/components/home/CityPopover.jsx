import React from "react";
import { ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// This is the new component for the city "popover"
export const CityPopover = ({
  open,
  onClose,
  cities,
  selectedCity,
  onCitySelect,
  triggerRef // A ref to the header that triggered this
}) => {
  
  // Get position of the trigger button
  const triggerRect = triggerRef.current?.getBoundingClientRect();
  
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
          {/* Popover Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-5 right-5 z-50 mt-2 bg-[#1c1d1f] rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
            // Position it right below the header
            style={{ top: triggerRect ? triggerRect.bottom + 8 : 120 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-white/10">
               <h3 className="text-sm font-semibold text-gray-100">Choose Destination</h3>
               <button onClick={onClose} className="text-gray-400 hover:text-white"> <X size={16} /> </button>
            </div>
            <div className="p-2 max-h-60 overflow-y-auto no-scrollbar">
              {cities.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCitySelect(c.name)}
                  className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition ${
                    c.name === selectedCity ? "bg-blue-600 text-white" : "hover:bg-white/10 text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.thumbnail || c.heroImageUrl || c.hero}
                      alt={c.name}
                      className="w-10 h-7 object-cover rounded-md"
                      loading="lazy"
                    />
                    <div className="flex flex-col leading-tight text-left">
                      <span className="font-medium text-sm">{c.name}</span>
                    </div>
                  </div>
                  {c.name === selectedCity && <ChevronRight size={18} />}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

