import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-brand-dark font-sans">
      {/* Pass dummy props or manage state if needed for cart */}
      <Navbar cartCount={0} onOpenCart={() => {}} />

      {/* Header Image */}
      <div className="relative w-full h-[40vh] bg-gray-100 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=2000&auto=format&fit=crop" 
          alt="Varanasi Weavers" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white font-serif text-5xl md:text-6xl tracking-wide text-center">Our Heritage</h1>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center md:text-left">
        <span className="text-[#B08D55] text-xs font-bold uppercase tracking-[0.2em] mb-4 block text-center">The Pahnawa Story</span>
        <h2 className="font-serif text-3xl md:text-4xl mb-8 text-center leading-tight">
          Reviving the Golden Age of <br/> Banarasi Craftsmanship
        </h2>
        
        <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-light text-justify md:text-center">
          <p>
            Nestled in the narrow lanes of Varanasi, the rhythmic clatter of handlooms has been the heartbeat of the city for centuries. Pahnawa Banaras was born from a desire to preserve this fading symphony.
          </p>
          <p>
            We are not just a brand; we are a movement to empower the master weavers who create magic with gold and silver threads. In an era of fast fashion, we stand for patience, purity, and the unparalleled beauty of the handmade.
          </p>
          <p>
            Every saree, lehenga, and dupatta in our collection is handpicked, ensuring that you receive not just a piece of cloth, but a piece of history.
          </p>
        </div>
      </div>

      {/* Values Grid */}
      <div className="bg-[#FFFCF7] py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-16 h-16 bg-[#B08D55]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🧵</span>
            </div>
            <h3 className="font-serif text-2xl mb-3">Pure Handloom</h3>
            <p className="text-gray-500 text-sm">Certified authentic weaves directly from the artisan's loom.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-[#B08D55]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🤝</span>
            </div>
            <h3 className="font-serif text-2xl mb-3">Fair Trade</h3>
            <p className="text-gray-500 text-sm">Ensuring our weavers receive fair compensation and recognition.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-[#B08D55]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-serif text-2xl mb-3">Global Legacy</h3>
            <p className="text-gray-500 text-sm">Taking the art of Banaras to connoisseurs around the world.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}