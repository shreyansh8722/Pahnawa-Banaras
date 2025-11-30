import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Spotlight = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center my-12">
      {/* Parallax Background */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1605293266891-ed0b980604fb?q=80&w=2000" // Replace with a rich close-up of fabric
          alt="Spotlight Background" 
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Floating Content Card */}
      <div className="relative z-10 bg-heritage-paper/95 backdrop-blur-sm p-12 max-w-lg text-center mx-4 border border-heritage-gold/30">
        <span className="text-heritage-gold text-[10px] uppercase tracking-[0.3em] mb-4 block">The Masterpiece Edit</span>
        <h2 className="font-serif text-4xl md:text-5xl text-heritage-charcoal mb-6 italic">The Shikargah Collection</h2>
        <p className="font-sans text-sm text-gray-600 leading-loose mb-8 font-light">
          Inspired by the royal hunting grounds, these sarees feature intricate animal motifs woven in gold and silver zari. A tribute to the grandeur of a bygone era.
        </p>
        <button className="bg-heritage-charcoal text-white px-8 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-heritage-gold transition-colors">
          View The Edit
        </button>
      </div>
    </section>
  );
};