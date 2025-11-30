import React from 'react';
import { Instagram } from 'lucide-react';

const MUSES = [
  { id: 1, image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800", handle: "@ishasharma" },
  { id: 2, image: "https://images.unsplash.com/photo-1594824476960-e78a914296d5?q=80&w=800", handle: "@diariesofbanaras" },
  { id: 3, image: "https://images.unsplash.com/photo-1621623194266-4b3664963684?q=80&w=800", handle: "@weddingwire_in" },
  { id: 4, image: "https://images.unsplash.com/photo-1583391726247-e29237d8612f?q=80&w=800", handle: "@thebanarasibride" },
];

export const MuseSection = () => {
  return (
    <section className="py-24 bg-white px-4 border-t border-heritage-border">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
           <div>
             <span className="text-heritage-gold text-[10px] uppercase tracking-[0.3em] block mb-3">#PahnawaBanaras</span>
             <h2 className="font-serif text-4xl text-heritage-charcoal italic">The Pahnawa Muse</h2>
           </div>
           <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] hover:text-heritage-gold transition-colors">
             <Instagram size={14} /> Follow Us
           </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MUSES.map((item) => (
            <div key={item.id} className="group relative aspect-[4/5] overflow-hidden cursor-pointer">
              <img 
                src={item.image} 
                alt="Muse" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Instagram className="text-white" />
              </div>
              <div className="absolute bottom-4 left-4">
                 <p className="text-white text-xs font-serif tracking-wide">{item.handle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};