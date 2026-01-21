import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { 
    id: 1, 
    name: "Silk Sarees", 
    img: "https://images.unsplash.com/photo-1610189012906-47833d772097?q=80&w=600", 
    link: "/shop?cat=sarees" 
  },
  { 
    id: 2, 
    name: "Bridal Lehengas", 
    img: "https://images.unsplash.com/photo-1583391726247-e29237d8612f?q=80&w=600", 
    link: "/shop?cat=lehengas" 
  },
  { 
    id: 3, 
    name: "Suit Sets", 
    img: "https://images.unsplash.com/photo-1621623194266-4b3664963684?q=80&w=600", 
    link: "/shop?cat=suits" 
  }
];

export const CategoryArchGrid = () => {
  return (
    <section className="py-12 md:py-24 bg-royal-cream">
      <div className="text-center mb-12 md:mb-16 px-4">
         <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-royal-grey">Curated Collections</span>
         <h2 className="font-display text-3xl md:text-4xl text-royal-maroon mt-3">The Royal Wardrobe</h2>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {CATEGORIES.map((cat) => (
          <Link to={cat.link} key={cat.id} className="group cursor-pointer block">
            {/* The Arch Frame */}
            <div className="relative overflow-hidden rounded-t-[10rem] border border-royal-gold/30 p-2 transition-all duration-300 hover:border-royal-gold">
               <div className="relative overflow-hidden rounded-t-[10rem] aspect-[3/4] bg-royal-sand">
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Dark Overlay on Hover */}
                  <div className="absolute inset-0 bg-royal-maroon/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
               </div>
            </div>
            
            <div className="text-center mt-6">
               <h3 className="font-serif text-2xl text-royal-charcoal group-hover:text-royal-maroon transition-colors duration-200">{cat.name}</h3>
               <span className="text-[10px] uppercase tracking-widest text-royal-gold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 block mt-2">
                 View Collection
               </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};