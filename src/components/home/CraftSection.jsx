import React from 'react';
import { Link } from 'react-router-dom';

export const CraftSection = () => {
  return (
    <section className="py-24 bg-royal-teal text-white relative overflow-hidden">
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

         <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16 relative z-10">
            
            {/* Image Side */}
            <div className="w-full md:w-1/2">
                <div className="relative border border-royal-gold/30 p-3 rounded-t-full">
                    <div className="overflow-hidden rounded-t-full aspect-[4/5] bg-royal-charcoal">
                        <img 
                            src="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80" 
                            alt="Weaver at loom" 
                            className="w-full h-full object-cover sepia-[0.2] hover:scale-105 transition-transform duration-[1200ms]"
                        />
                    </div>
                </div>
            </div>

            {/* Text Side */}
            <div className="w-full md:w-1/2 space-y-8">
                <div>
                    <span className="text-royal-gold text-xs font-bold uppercase tracking-[0.2em]">The Craft</span>
                    <h2 className="font-display text-4xl md:text-5xl mt-4 leading-tight">Woven with <br/> Soul & Silence</h2>
                </div>
                
                <p className="font-sans font-light text-white/80 leading-relaxed text-lg">
                    In the narrow lanes of Banaras, the rhythm of the handloom beats in sync with the chants of the Ghats. Every thread tells a story of patience, every motif a symbol of our rich ancestry.
                </p>

                <div className="grid grid-cols-2 gap-8 py-6 border-t border-white/10">
                    <div>
                        <h4 className="text-3xl font-display text-royal-gold">500+</h4>
                        <p className="text-xs uppercase tracking-widest text-white/60 mt-1">Master Weavers</p>
                    </div>
                    <div>
                        <h4 className="text-3xl font-display text-royal-gold">100%</h4>
                        <p className="text-xs uppercase tracking-widest text-white/60 mt-1">Silk Mark Certified</p>
                    </div>
                </div>

                <Link to="/about" className="inline-block border-b border-royal-gold pb-1 text-royal-gold uppercase tracking-widest text-xs hover:text-white hover:border-white transition-colors duration-200">
                    Read Our Story
                </Link>
            </div>
         </div>
    </section>
  );
};