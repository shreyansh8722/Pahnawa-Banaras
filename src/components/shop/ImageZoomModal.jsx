import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export const ImageZoomModal = ({ isOpen, onClose, images, initialIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/95 backdrop-blur-md">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-900" />
          </button>

          {/* Nav Buttons */}
          <button 
            onClick={handlePrev}
            className="absolute left-4 z-40 p-3 bg-white shadow-lg rounded-full text-gray-800 hover:scale-110 transition-transform hidden md:block"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-4 z-40 p-3 bg-white shadow-lg rounded-full text-gray-800 hover:scale-110 transition-transform hidden md:block"
          >
            <ChevronRight size={24} />
          </button>

          {/* Main Image Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full h-full max-w-5xl max-h-[90vh] p-4 flex items-center justify-center overflow-hidden cursor-zoom-in"
            onClick={() => setIsZoomed(!isZoomed)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <img 
              src={images[activeIndex]} 
              alt="Zoom Preview" 
              className={`max-w-full max-h-full object-contain transition-transform duration-100 ease-linear ${isZoomed ? 'scale-[2.5] cursor-zoom-out' : 'scale-100'}`}
              style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
            />
            
            {!isZoomed && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 pointer-events-none">
                    <ZoomIn size={14} /> Tap to Zoom
                </div>
            )}
          </motion.div>

          {/* Bottom Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] p-2 scrollbar-hide z-40">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(idx); setIsZoomed(false); }}
                className={`w-12 h-16 md:w-16 md:h-20 flex-shrink-0 border-2 rounded-sm overflow-hidden transition-all ${activeIndex === idx ? 'border-[#B08D55] opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>
      )}
    </AnimatePresence>
  );
};