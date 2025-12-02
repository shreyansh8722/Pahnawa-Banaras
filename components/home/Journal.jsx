import React from 'react';

export const Journal = () => {
  return (
    <section className="py-24 px-6 md:px-20 max-w-[1920px] mx-auto bg-white border-t border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <h2 className="font-serif text-4xl text-[#1a1a1a]">The Banaras Journal</h2>
        <button className="hidden md:block text-xs uppercase tracking-widest text-gray-500 hover:text-black">
            Read All Stories
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="group cursor-pointer">
          <div className="overflow-hidden mb-6 aspect-[16/9]">
            <img src="https://images.unsplash.com/photo-1599707367072-cd6ad66acc40?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Ghats" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] mb-2 block">Culture</span>
          <h3 className="font-serif text-2xl text-[#1a1a1a] mb-2 group-hover:text-[#B08D55] transition-colors">Sunrise at Assi Ghat: A Weaver's Inspiration</h3>
          <p className="text-sm text-gray-500 font-light">How the colors of the morning sky influence our latest collection.</p>
        </div>
        <div className="group cursor-pointer">
          <div className="overflow-hidden mb-6 aspect-[16/9]">
            <img src="https://images.unsplash.com/photo-1601300024508-3729221147a4?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Silk" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] mb-2 block">Heritage</span>
          <h3 className="font-serif text-2xl text-[#1a1a1a] mb-2 group-hover:text-[#B08D55] transition-colors">The Journey of a Katan Silk Saree</h3>
          <p className="text-sm text-gray-500 font-light">Tracing the 200-hour process from cocoon to your wardrobe.</p>
        </div>
      </div>
    </section>
  );
};