import React from 'react';
import { Instagram } from 'lucide-react';

export const MuseSection = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-royal-gold">#PahnawaMuse</span>
        <h2 className="font-display text-4xl text-royal-charcoal mt-2">As Seen On You</h2>
      </div>

      {/* Scrolling Marquee or Grid */}
      <div className="overflow-hidden">
        <div className="flex gap-4 min-w-full px-4 overflow-x-auto md:grid md:grid-cols-5 md:overflow-visible scrollbar-hide">
            {images.map((img, idx) => (
                <div key={idx} className="relative group min-w-[200px] aspect-[3/4] overflow-hidden bg-royal-sand">
                    <img 
                        src={img} 
                        alt={`Muse ${idx}`} 
                        className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-royal-maroon/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <Instagram className="text-white" size={32} />
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};