import React, { useState, useEffect } from 'react';

// --- DIRECT ASSET IMPORTS ---
import hero1 from '../../assets/hero1.webp';
import hero2 from '../../assets/hero2.webp';
import hero3 from '../../assets/hero3.webp';

const SLIDES = [
  { id: 1, image: hero1 },
  { id: 2, image: hero2 },
  { id: 3, image: hero3 }
];

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-Rotation Timer (7 Seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 7000); 
    return () => clearInterval(timer);
  }, []);

  return (
    // OPTIMIZATION: Reduced height to 50vh (mobile) and 75vh (desktop)
    <div className="relative h-[50vh] md:h-[75vh] w-full overflow-hidden bg-royal-charcoal transition-all duration-500">
      
      {/* --- BACKGROUND IMAGES --- */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Ken Burns Scale Effect */}
          <div className={`w-full h-full transform will-change-transform transition-transform duration-[10000ms] ease-linear ${
             index === currentIndex ? "scale-110" : "scale-100"
          }`}>
             <img
                src={slide.image}
                alt="Hero Slide"
                className="w-full h-full object-cover opacity-90"
                loading={index === 0 ? "eager" : "lazy"} 
                decoding="async"
             />
          </div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
        </div>
      ))}

      {/* --- PROGRESS BARS --- */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 z-30 flex gap-3">
        {SLIDES.map((_, idx) => (
          <div 
            key={idx} 
            className="h-[3px] w-8 md:w-12 bg-white/30 overflow-hidden rounded-full cursor-pointer backdrop-blur-sm transition-all hover:bg-white/50"
            onClick={() => setCurrentIndex(idx)}
          >
            <div 
              className={`h-full bg-royal-gold transition-all duration-[7000ms] ease-linear ${
                idx === currentIndex ? "w-full" : "w-0 opacity-0"
              }`} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};