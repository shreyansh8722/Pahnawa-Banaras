import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Import createPortal
import { motion, AnimatePresence } from 'framer-motion';
import { ImageZoomModal } from './ImageZoomModal';
import { Expand } from 'lucide-react';

export const ProductGallery = ({ images, name }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const scrollRef = useRef(null);
  const thumbRef = useRef(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    if (thumbRef.current) {
      const activeThumb = thumbRef.current.children[activeIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeIndex]);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full select-none">
      
      {/* DESKTOP */}
      <div className="hidden md:flex gap-4 h-[600px] lg:h-[700px] w-full">
        <div ref={thumbRef} className="w-20 lg:w-24 flex flex-col gap-3 overflow-y-auto scrollbar-hide h-full shrink-0 py-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-full aspect-[3/4] flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all duration-200 ${activeIndex === idx ? 'border-[#B08D55] opacity-100 ring-1 ring-[#B08D55]' : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'}`}
            >
              <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <div className="flex-grow relative bg-gray-50 overflow-hidden rounded-sm cursor-zoom-in group h-full w-full" onClick={() => setIsZoomOpen(true)}>
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${name} - View ${activeIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </AnimatePresence>
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 text-[10px] font-bold uppercase tracking-widest shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full pointer-events-none text-gray-800 flex items-center gap-2">
             <Expand size={14} /> Click to Zoom
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden relative w-full bg-gray-100">
        <div className="h-[60vh] w-full relative">
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              style={{ scrollBehavior: 'smooth' }}
            >
              {images.map((img, idx) => (
                <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                  <img 
                    src={img}
                    alt={`${name} view ${idx}`}
                    className="w-full h-full object-cover"
                    onClick={() => {
                      setActiveIndex(idx);
                      setIsZoomOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
        </div>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 p-2 rounded-full bg-black/20 backdrop-blur-sm">
          {images.map((_, idx) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${activeIndex === idx ? 'bg-white w-6' : 'bg-white/50 w-1.5'}`} />
          ))}
        </div>
      </div>

      {/* Zoom Modal - Rendered via Portal */}
      {isZoomOpen && createPortal(
        <ImageZoomModal 
          isOpen={isZoomOpen} 
          onClose={() => setIsZoomOpen(false)}
          images={images}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />,
        document.body
      )}
    </div>
  );
};