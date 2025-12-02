import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useSiteAssets } from '@/hooks/useSiteAssets';

export const Hero = () => {
  const navigate = useNavigate();
  const { assets, getAsset } = useSiteAssets();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fallback images if assets aren't loaded yet
  const slides = [
    {
      image: getAsset('hero_slide_1') || "https://images.unsplash.com/photo-1610189012906-47833d772097?q=80&w=2000",
      title: "Eternal Banaras",
      subtitle: "Authentic Handloom, Ready for You."
    },
    {
      image: getAsset('hero_slide_2') || "https://images.unsplash.com/photo-1583391726247-e29237d8612f?auto=format&fit=crop&q=80",
      title: "Bridal Heritage",
      subtitle: "Curated Masterpieces from the Ghats."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0a] text-white">
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={slides[currentSlide].image} 
            alt="Hero" 
            className="w-full h-full object-cover opacity-80" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-32 px-6 md:px-20 max-w-[1920px] mx-auto">
        <motion.div 
          key={`text-${currentSlide}`}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-4xl"
        >
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 text-white/80 border-l-2 border-white/50 pl-4">
            Authentic • Handpicked
          </p>
          <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl leading-[0.9] text-white mb-8 font-light">
            {slides[currentSlide].title}
          </h1>
          <p className="font-sans text-sm md:text-lg text-white/80 font-light tracking-wide mb-10 max-w-xl leading-relaxed">
            {slides[currentSlide].subtitle}
          </p>
          
          <button 
            onClick={() => navigate('/shop')}
            className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.25em] hover:text-[#B08D55] transition-colors"
          >
            Explore Collection
            <span className="w-12 h-[1px] bg-white group-hover:bg-[#B08D55] transition-colors" />
          </button>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 right-10 md:right-20 z-20 hidden md:flex flex-col items-center gap-4 mix-blend-difference"
      >
        <span className="text-[9px] uppercase tracking-widest writing-vertical-rl rotate-180 text-white">Scroll</span>
        <ArrowDown size={20} className="text-white" strokeWidth={1} />
      </motion.div>
    </div>
  );
};