import React from 'react';
import { motion } from 'framer-motion';

export const HeritageSection = () => {
  return (
    <section className="relative py-20 md:py-32 bg-[#1A1A1A] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-linen.png")' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#B08D55] font-bold text-xs uppercase tracking-[0.3em] mb-4 block">The Legacy</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Weaving Stories <br/> Since 1985
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-md">
            In the narrow lanes of Varanasi, the rhythmic clatter of handlooms tells a story of patience and perfection. 
            Each Pahnawa saree takes our master artisans between 15 to 30 days to weave, ensuring that you don't just wear a garment, but a piece of history.
          </p>
          
          <div className="flex gap-8 border-t border-gray-800 pt-8">
            <div>
              <p className="text-3xl font-serif text-white">500+</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Artisans</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-white">100%</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Handwoven</p>
            </div>
          </div>
        </motion.div>

        {/* Image Composition */}
        <div className="relative h-[400px] md:h-[500px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="absolute top-0 right-0 w-3/4 h-3/4 z-10"
          >
             <img 
               src="https://images.unsplash.com/photo-1610189012906-47833d7b3a4c?w=800&q=80" 
               alt="Weaving loom" 
               className="w-full h-full object-cover rounded-sm shadow-2xl border border-gray-800"
             />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute bottom-0 left-0 w-3/5 h-3/5 z-20"
          >
             <img 
               src="https://images.unsplash.com/photo-1583391726247-e29237d8612f?w=600&q=80" 
               alt="Golden threads" 
               className="w-full h-full object-cover rounded-sm shadow-2xl border-4 border-[#1A1A1A]"
             />
          </motion.div>
        </div>

      </div>
    </section>
  );
};