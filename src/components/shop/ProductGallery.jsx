import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ImageZoomModal } from './ImageZoomModal';

export const ProductGallery = ({ images, name }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  if (!images || images.length === 0) return null;

  // Mobile Scroll Listener
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
      setActiveIndex(index);
    }
  };

  // Desktop Hover Zoom
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="w-full select-none">
      <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
        
        {/* Desktop Thumbnails */}
        <div className="hidden md:flex md:flex-col gap-3 overflow-y-auto scrollbar-hide md:w-20 lg:w-24 shrink-0 py-1 h-[600px] lg:h-[700px]">
          {images.map((img, idx) => (
            <button
              key={idx}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-full aspect-[3/4] flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                activeIndex === idx 
                  ? 'border-[#B08D55] ring-1 ring-[#B08D55] opacity-100' 
                  : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300'
              }`}
            >
              <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Main Display */}
        <div 
          ref={containerRef}
          className="relative flex-grow bg-white rounded-none md:rounded-lg overflow-hidden group h-[60vh] md:h-[600px] lg:h-[700px] w-full cursor-crosshair"
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseLeave={() => setShowMagnifier(false)}
          onMouseMove={handleMouseMove}
        >
          
          {/* Mobile Carousel */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full h-full"
          >
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className="w-full h-full flex-shrink-0 snap-center relative"
                onClick={() => setIsZoomOpen(true)}
              >
                <img src={img} alt={`${name} ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Mobile Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 md:hidden pointer-events-none z-10">
            {images.map((_, idx) => (
              <div 
                key={idx}
                className={`rounded-full transition-all duration-300 shadow-sm border border-white/20 ${
                  activeIndex === idx 
                    ? 'bg-white w-2 h-2 opacity-100 scale-110' 
                    : 'bg-white/60 w-1.5 h-1.5 opacity-70'
                }`}
              />
            ))}
          </div>

          {/* Desktop Image */}
          <div className="hidden md:block w-full h-full overflow-hidden relative" onClick={() => setIsZoomOpen(true)}>
             <img
                src={images[activeIndex]}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-100 ease-out will-change-transform"
                style={{
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transform: showMagnifier ? "scale(2)" : "scale(1)",
                }}
             />
          </div>

          {/* Desktop Arrows */}
          {!showMagnifier && images.length > 1 && (
            <div className="hidden md:flex absolute inset-0 items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
               <button className="pointer-events-auto p-2 rounded-full bg-white/90 text-gray-800 shadow-lg hover:bg-white transition-all" onClick={(e) => { e.stopPropagation(); setActiveIndex(prev => prev === 0 ? images.length -1 : prev -1); }}>
                 <ChevronLeft size={24} />
               </button>
               <button className="pointer-events-auto p-2 rounded-full bg-white/90 text-gray-800 shadow-lg hover:bg-white transition-all" onClick={(e) => { e.stopPropagation(); setActiveIndex(prev => prev === images.length -1 ? 0 : prev + 1); }}>
                 <ChevronRight size={24} />
               </button>
            </div>
          )}

          {/* Desktop Hint */}
          <div className={`hidden md:flex absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-[10px] font-bold uppercase tracking-widest text-gray-800 items-center gap-2 transition-opacity duration-300 ${showMagnifier ? 'opacity-0' : 'opacity-100'}`}>
             <Maximize2 size={12} /> Click to Expand
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomOpen && createPortal(
        <ImageZoomModal 
          isOpen={isZoomOpen} 
          onClose={() => setIsZoomOpen(false)}
          images={images}
          initialIndex={activeIndex}
        />,
        document.body
      )}
    </div>
  );
};