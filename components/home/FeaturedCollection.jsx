import React from 'react';
import { useNavigate } from 'react-router-dom';

export const FeaturedCollection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden my-16">
      {/* Background Image */}
      <img 
        src="https://images.unsplash.com/photo-1605293266891-ed0b980604fb?q=80&w=2000" // Replace with a wide banner image
        alt="Featured Collection" 
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content Box - Centered */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <div className="bg-white/90 backdrop-blur-sm p-10 md:p-16 max-w-2xl border border-white/50 shadow-2xl">
          <span className="text-heritage-gold text-[10px] uppercase tracking-[0.3em] mb-4 block">
            Autumn Winter 2025
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-heritage-charcoal mb-6 italic">
            The Kashi Edit
          </h2>
          <p className="font-sans text-gray-600 leading-loose mb-8 font-light">
            An ode to the timeless city. Featuring classic Kadhua weaves, Jangla patterns, and the rich heritage of Banaras reimagined for the modern muse.
          </p>
          <button 
            onClick={() => navigate('/shop')}
            className="border border-heritage-charcoal text-heritage-charcoal px-10 py-3 text-[11px] uppercase tracking-[0.2em] hover:bg-heritage-charcoal hover:text-white transition-all duration-300"
          >
            View The Collection
          </button>
        </div>
      </div>
    </section>
  );
};