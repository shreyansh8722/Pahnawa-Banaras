import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const ImageZoomModal = ({ isOpen, onClose, images, activeIndex, setActiveIndex }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Lock Body Scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Prevent touch scrolling on mobile
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      setIsZoomed(false);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDoubleTap = (e) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col h-screen w-screen overflow-hidden touch-none"
      >
        {/* Header (Close Button) */}
        <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-gradient-to-b from-black/60 to-transparent">
           <span className="text-white text-xs font-bold tracking-widest opacity-80">
             {activeIndex + 1} / {images.length}
           </span>
           <button 
             onClick={onClose} 
             className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-all"
           >
             <X size={24} />
           </button>
        </div>

        {/* Main Image Area */}
        <div className="flex-1 flex items-center justify-center relative w-full h-full">
           <motion.div
             className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ${
               isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
             }`}
             onClick={handleDoubleTap}
           >
             <img
               src={images[activeIndex]}
               alt="Zoom view"
               className="max-h-full max-w-full object-contain select-none"
               style={{ 
                 transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                 transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                 touchAction: 'manipulation' 
               }}
               draggable={false}
             />
           </motion.div>

           {/* Navigation Arrows (Hidden when zoomed) */}
           {!isZoomed && (
             <>
               {activeIndex > 0 && (
                 <button 
                   className="absolute left-4 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
                   onClick={(e) => { e.stopPropagation(); setActiveIndex(Math.max(0, activeIndex - 1)); }}
                 >
                   <ChevronLeft size={24} />
                 </button>
               )}
               {activeIndex < images.length - 1 && (
                 <button 
                   className="absolute right-4 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
                   onClick={(e) => { e.stopPropagation(); setActiveIndex(Math.min(images.length - 1, activeIndex + 1)); }}
                 >
                   <ChevronRight size={24} />
                 </button>
               )}
             </>
           )}
           
           {/* Hint Text */}
           {!isZoomed && (
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full">
               <p className="text-white/90 text-[10px] uppercase tracking-widest font-bold animate-pulse">
                 Double Tap to Zoom
               </p>
             </div>
           )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};