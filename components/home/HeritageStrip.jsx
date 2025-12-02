import React from 'react';

export const HeritageStrip = () => {
  return (
    <section className="py-24 bg-[#F8F5F1]"> {/* Very light beige background */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left: Text Story */}
        <div className="max-w-xl">
           <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B08D55] mb-6 block">
             The Art of Handloom
           </span>
           <h2 className="font-serif text-4xl md:text-6xl text-[#1a1a1a] mb-8 leading-[1.1]">
             100 Hours of <br/> <span className="italic text-gray-500">Patience</span>
           </h2>
           <p className="font-sans text-gray-600 text-lg font-light leading-relaxed mb-8">
             A single Tilfi/Pehnawa saree passes through the hands of 12 distinct artisans. From the dyer who perfects the yarn to the weaver who spends weeks on the loom, we preserve the slow, meditative rhythm of Banaras.
           </p>
           <button className="text-xs font-bold uppercase tracking-[0.25em] border-b border-black pb-2 hover:text-[#B08D55] hover:border-[#B08D55] transition-colors">
             Read The Process
           </button>
        </div>

        {/* Right: The Visual (Ideally a GIF or Video Loop) */}
        <div className="relative h-[60vh] overflow-hidden rounded-sm">
           <img 
             src="https://images.unsplash.com/photo-1606744888123-2479e4362143?q=80&w=1200" 
             alt="Weaving Process"
             className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" 
           />
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
             </div>
           </div>
        </div>

      </div>
    </section>
  );
};