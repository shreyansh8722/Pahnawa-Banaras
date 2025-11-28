import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export const ImageZoomModal = ({ isOpen, onClose, images, initialIndex }) => {
  const [index, setIndex] = useState(initialIndex);
  
  // --- State for smoothness ---
  // We use refs for animation values to avoid React re-render lag during gestures
  const imgRef = useRef(null);
  const state = useRef({
    scale: 1,
    panning: false,
    pointX: 0,
    pointY: 0,
    startX: 0,
    startY: 0,
    cssScale: 1 // tracks current css scale
  });

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }
    return () => { 
      document.body.style.overflow = ''; 
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  // Reset on image change
  useEffect(() => {
    resetZoom();
  }, [index]);

  const updateTransform = () => {
    if (!imgRef.current) return;
    const { pointX, pointY, scale } = state.current;
    // Hardware accelerated transform
    imgRef.current.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
  };

  const resetZoom = () => {
    state.current = { ...state.current, scale: 1, pointX: 0, pointY: 0 };
    if (imgRef.current) {
      imgRef.current.style.transition = 'transform 0.3s ease-out';
      updateTransform();
      setTimeout(() => {
        if (imgRef.current) imgRef.current.style.transition = '';
      }, 300);
    }
  };

  // --- TOUCH HANDLERS (Native Feel) ---
  
  const onTouchStart = (e) => {
    if (e.touches.length === 1 && state.current.scale > 1) {
      // Start Panning
      state.current.panning = true;
      state.current.startX = e.touches[0].clientX - state.current.pointX;
      state.current.startY = e.touches[0].clientY - state.current.pointY;
    } else if (e.touches.length === 2) {
      // Start Pinching - handled by gesture events in some browsers, but we do manual here
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      state.current.startDist = dist;
      state.current.startScale = state.current.scale;
    }
  };

  const onTouchMove = (e) => {
    e.preventDefault(); // Prevent default browser zoom behavior

    if (e.touches.length === 1 && state.current.panning && state.current.scale > 1) {
      // --- PAN LOGIC ---
      const x = e.touches[0].clientX - state.current.startX;
      const y = e.touches[0].clientY - state.current.startY;

      // Boundary Constraints
      const rect = imgRef.current.getBoundingClientRect();
      const parentRect = imgRef.current.parentElement.getBoundingClientRect();
      
      // Calculate max pan allowed based on how much larger the image is than the screen
      const maxOverflowX = (rect.width - parentRect.width) / 2;
      const maxOverflowY = (rect.height - parentRect.height) / 2;

      // Only limit if image is actually bigger than screen
      if (maxOverflowX > 0) {
         state.current.pointX = Math.min(Math.max(x, -maxOverflowX), maxOverflowX);
      }
      if (maxOverflowY > 0) {
         state.current.pointY = Math.min(Math.max(y, -maxOverflowY), maxOverflowY);
      }
      
      updateTransform();

    } else if (e.touches.length === 2) {
      // --- PINCH ZOOM LOGIC ---
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      if (state.current.startDist) {
        const zoomSpeed = 1; // Control sensitivity
        const scaleChange = dist / state.current.startDist;
        const newScale = state.current.startScale * scaleChange * zoomSpeed;

        // Clamp scale between 1x and 4x
        state.current.scale = Math.min(Math.max(1, newScale), 4);
        
        // If zooming out to 1, recenter
        if (state.current.scale === 1) {
           state.current.pointX = 0;
           state.current.pointY = 0;
        }
        updateTransform();
      }
    }
  };

  const onTouchEnd = () => {
    state.current.panning = false;
    // Snap back if dragged too far or scaled < 1 (rubber banding effect)
    if (state.current.scale < 1) {
      resetZoom();
    }
  };

  // Double Tap Logic
  const lastTap = useRef(0);
  const handleDoubleTap = (e) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      e.preventDefault();
      if (state.current.scale > 1) {
        resetZoom();
      } else {
        state.current.scale = 2.5;
        state.current.pointX = 0;
        state.current.pointY = 0;
        if (imgRef.current) {
           imgRef.current.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
           updateTransform();
           setTimeout(() => imgRef.current.style.transition = '', 300);
        }
      }
    }
    lastTap.current = now;
  };

  // Simple Pagination
  const nextImage = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const prevImage = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-white flex flex-col"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <span className="text-gray-600 font-bold text-xs tracking-widest">
          {index + 1} / {images.length}
        </span>
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Canvas */}
      <div 
        className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center touch-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={handleDoubleTap} // fallback for desktop double click
      >
        <img
          ref={imgRef}
          src={images[index]}
          alt={`Zoom ${index}`}
          className="max-w-full max-h-full object-contain will-change-transform origin-center"
          draggable={false}
          style={{ touchAction: 'none' }}
        />

        {/* Navigation Overlay (Visible on edges) */}
        {images.length > 1 && state.current.scale === 1 && (
           <>
             <div className="absolute left-0 top-0 bottom-0 w-1/4 z-10" onClick={prevImage} />
             <div className="absolute right-0 top-0 bottom-0 w-1/4 z-10" onClick={nextImage} />
           </>
        )}
      </div>

      {/* Dots Indicator (Flipkart Style) - Hide if zoomed */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 pointer-events-none z-50">
        {images.map((_, idx) => (
          <div 
            key={idx}
            className={`rounded-full transition-all duration-300 shadow-sm ${
              index === idx 
                ? 'bg-gray-800 w-1.5 h-1.5' 
                : 'bg-gray-300 w-1 h-1'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};