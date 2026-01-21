import React from 'react';
import { Link } from 'react-router-dom';

export const FabricEdit = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-24 bg-white border-t border-royal-border/20">
      <div className="container mx-auto px-6 md:px-12 text-center mb-16">
         <span className="text-xs font-bold uppercase tracking-[0.2em] text-royal-gold">The Fabric Edit</span>
         <h2 className="font-display text-4xl text-royal-charcoal mt-3">Textures of Tradition</h2>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
         {images.slice(0, 4).map((img, idx) => (
            <Link to="/shop" key={idx} className="group relative overflow-hidden aspect-[3/4] bg-royal-sand cursor-pointer">
               <img 
                 src={img} 
                 alt={`Fabric ${idx}`} 
                 className="w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-royal-maroon/20 transition-colors duration-300" />
               <div className="absolute bottom-6 left-6 right-6 border border-white/30 p-4 text-center text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Shop Now</span>
               </div>
            </Link>
         ))}
      </div>
    </section>
  );
};