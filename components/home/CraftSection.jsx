import React from 'react';
import { motion } from 'framer-motion';

export const CraftSection = () => {
  return (
    <section className="py-24 bg-heritage-sand/30 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        
        {/* Image Grid */}
        <div className="relative h-[500px] md:h-[600px] w-full">
           <div className="absolute top-0 right-0 w-3/4 h-3/4 overflow-hidden rounded-sm z-10">
             <img 
               src="https://images.unsplash.com/photo-1610189012906-47833d7b3a4c?w=800&q=80" // Loom Image
               alt="Handloom" 
               className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
             />
           </div>
           <div className="absolute bottom-0 left-0 w-2/3 h-2/3 overflow-hidden rounded-sm z-20 border-8 border-[#F9F7F4]">
             <img 
               src="https://images.unsplash.com/photo-1596289456578-192569e54d36?q=80&w=800" // Artisan hands
               alt="Craft" 
               className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
             />
           </div>
        </div>

        {/* Text Content */}
        <div className="md:pl-10">
          <span className="text-heritage-gold text-[10px] uppercase tracking-[0.3em] mb-6 block">
            The Philosophy
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-heritage-charcoal mb-8 leading-tight">
            Born in Banaras, <br/> Woven for the World.
          </h2>
          <div className="space-y-6 text-gray-600 font-sans font-light leading-loose text-lg">
            <p>
              Pahnawa Banaras is more than a brand; it is a custodian of India's textile heritage. 
              We work directly with master artisans to revive lost motifs and techniques.
            </p>
            <p>
              Every thread tells a story of patience. From the selection of pure mulberry silk 
              to the rhythmic clatter of the handloom, our creations are not just garments—they are 
              pieces of art that transcend generations.
            </p>
          </div>
          <div className="mt-10 flex gap-12">
            <div>
              <p className="font-serif text-3xl text-heritage-charcoal">40+</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Years of Legacy</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-heritage-charcoal">100%</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Handloom Purity</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};