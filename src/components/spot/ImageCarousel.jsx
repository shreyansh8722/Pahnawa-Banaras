import React, { useState, useRef, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ImageCarousel = memo(({ images = [], spotName = "Spot" }) => {
  const [index, setIndex] = useState(0);
  const startX = useRef(null);
  
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (startX.current === null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    if (delta < -50 && index < images.length - 1) {
      setIndex((i) => i + 1);
    }
    if (delta > 50 && index > 0) {
      setIndex((i) => i - 1);
    }
    startX.current = null;
  };

  const validImages = Array.isArray(images) ? images.filter(img => typeof img === 'string' && img.trim() !== '') : [];
  const imageCount = validImages.length;

  if (imageCount === 0) {
    return (
      <div className="fixed top-0 left-0 right-0 w-full h-[400px] bg-gray-800/40 flex items-center justify-center z-0">
        <img 
            src="https://placehold.co/600x400/1a1b1e/3a3b3e?text=No+Image" 
            alt="No image available" 
            className="w-full h-full object-cover opacity-50"
        />
      </div>
    );
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 w-full h-[400px] overflow-hidden z-0 select-none bg-gray-800/40" 
      onTouchStart={handleTouchStart} 
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} mode="popLayout">
          <motion.img
            key={validImages[index]}
            src={validImages[index]}
            alt={`${spotName} image ${index + 1}`}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable="false"
          />
      </AnimatePresence>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"/>
      
      {/* Controls */}
      {imageCount > 1 && (
        <>
          {index > 0 && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 backdrop-blur-md text-white rounded-full shadow-lg flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="drop-shadow-sm" />
            </motion.button>
          )}
          {index < imageCount - 1 && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIndex((i) => Math.min(imageCount - 1, i + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 backdrop-blur-md text-white rounded-full shadow-lg flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="drop-shadow-sm" />
            </motion.button>
          )}
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
            {validImages.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  i === index ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});
