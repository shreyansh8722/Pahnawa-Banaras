import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Hand, ZoomIn, ZoomOut } from 'lucide-react';

export const ImageZoomModal = ({ isOpen, onClose, images, activeIndex, setActiveIndex }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const lastTap = useRef(0);
  const constraintsRef = useRef(null);

  // Reset state when image changes
  useEffect(() => {
    setIsZoomed(false);
    setScale(1);
  }, [activeIndex]);

  // Lock Body Scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // Prevent mobile scroll gestures
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      setIsZoomed(false);
      setScale(1);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleZoom = () => {
    const newZoomState = !isZoomed;
    setIsZoomed(newZoomState);
    setScale(newZoomState ? 2.5 : 1); // 2.5x zoom for clear detail
  };

  const handleDoubleTap = (e) => {
    e.stopPropagation();
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      toggleZoom();
    }
    lastTap.current = now;
  };

  const handleZoomIn = () => {
    setIsZoomed(true);
    setScale(prev => Math.min(prev + 0.5, 4)); // Max 4x
  };

  const handleZoomOut = () => {
    if (scale <= 1.5) {
      setIsZoomed(false);
      setScale(1);
    } else {
      setScale(prev => prev - 0.5);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] bg-black/95 flex flex-col h-screen w-screen overflow-hidden touch-none"
        onClick={onClose} // Close on background click
      >
        {/* --- Controls Header --- */}
        <div 
          className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"
        >
           <span className="text-white/80 text-xs font-bold tracking-widest pl-2">
             {activeIndex + 1} / {images.length}
           </span>

           {/* Action Buttons (Pointer Events Auto) */}
           <div className="flex items-center gap-4 pointer-events-auto">
             {/* Zoom Controls */}
             <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/10">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                  className="p-2 text-white hover:text-[#B08D55] transition-colors disabled:opacity-30"
                  disabled={scale <= 1}
                >
                  <ZoomOut size={20} />
                </button>
                <span className="text-[10px] font-mono text-white w-8 text-center">{Math.round(scale * 100)}%</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                  className="p-2 text-white hover:text-[#B08D55] transition-colors disabled:opacity-30"
                  disabled={scale >= 4}
                >
                  <ZoomIn size={20} />
                </button>
             </div>

             {/* Close */}
             <button 
               onClick={onClose} 
               className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
             >
               <X size={24} />
             </button>
           </div>
        </div>

        {/* --- Main Image Area (Constrained Drag) --- */}
        <div 
          ref={constraintsRef}
          className="flex-1 flex items-center justify-center relative w-full h-full overflow-hidden"
        >
           <motion.div
             className="relative flex items-center justify-center"
             onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
             onTap={handleDoubleTap}
             
             // Drag Logic
             drag={isZoomed}
             dragConstraints={constraintsRef}
             dragElastic={0.1}
             dragMomentum={true}
             
             // Animation
             animate={{ scale: scale, x: isZoomed ? 0 : 0, y: isZoomed ? 0 : 0 }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
             
             style={{ 
               cursor: isZoomed ? 'grab' : 'zoom-in',
               touchAction: 'none'
             }}
             whileTap={{ cursor: isZoomed ? 'grabbing' : 'zoom-in' }}
           >
             <img
               src={images[activeIndex]}
               alt="Zoom view"
               className="max-h-screen max-w-screen object-contain select-none pointer-events-none"
               draggable={false}
             />
           </motion.div>

           {/* --- Navigation Arrows (Hidden when zoomed) --- */}
           {!isZoomed && (
             <>
               {activeIndex > 0 && (
                 <button 
                   className="absolute left-4 p-4 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-all z-40"
                   onClick={(e) => { e.stopPropagation(); setActiveIndex(Math.max(0, activeIndex - 1)); }}
                 >
                   <ChevronLeft size={32} />
                 </button>
               )}
               {activeIndex < images.length - 1 && (
                 <button 
                   className="absolute right-4 p-4 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-all z-40"
                   onClick={(e) => { e.stopPropagation(); setActiveIndex(Math.min(images.length - 1, activeIndex + 1)); }}
                 >
                   <ChevronRight size={32} />
                 </button>
               )}
             </>
           )}
           
           {/* --- Hand Tool Hint --- */}
           {isZoomed && (
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-2 border border-white/10 pointer-events-none animate-in fade-in slide-in-from-bottom-4">
               <Hand size={16} className="text-[#B08D55] animate-pulse" />
               <p className="text-white/90 text-xs font-medium tracking-wide">
                 Drag to Pan
               </p>
             </div>
           )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};