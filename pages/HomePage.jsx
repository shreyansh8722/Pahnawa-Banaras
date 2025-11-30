import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENTS ---
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { SEO } from '@/components/SEO';

// --- HOME SPECIFIC COMPONENTS ---
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedCollection } from '@/components/home/FeaturedCollection';
import { CraftSection } from '@/components/home/CraftSection';
import { MuseSection } from '@/components/home/MuseSection';
import { TestimonialSlider } from '@/components/home/TestimonialSlider';
import { ProductCard } from '@/components/shop/ProductCard'; // For New Arrivals
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/hooks/useFavorites';

// --- ICONS & ASSETS ---
import { ArrowRight, Sparkles, Gem, ScrollText, Leaf } from 'lucide-react';
import HeroImg1 from '@/assets/hero1.webp'; 
import HeroImg2 from '@/assets/hero2.webp';
import HeroImg3 from '@/assets/hero3.webp';

// --- HERO CONFIGURATION ---
const HERO_SLIDES = [
  {
    id: 1,
    image: HeroImg1, 
    subtitle: "Heritage Collection",
    title: "The Golden Loom",
  },
  {
    id: 2,
    image: HeroImg2, 
    subtitle: "Bridal Edit",
    title: "Weaving Dreams",
  },
  {
    id: 3,
    image: HeroImg3, 
    subtitle: "Pure Silk",
    title: "Timeless Elegance",
  }
];

// --- SUB-COMPONENTS ---

const CinematicHero = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setIndex(p => (p + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-heritage-charcoal">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-black/20 z-10" />
          <img src={HERO_SLIDES[index].image} alt="Hero" className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
         <motion.div
           key={index}
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
         >
           <span className="text-xs md:text-sm font-sans uppercase tracking-[0.4em] text-white/90 mb-6 block">
             {HERO_SLIDES[index].subtitle}
           </span>
           <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl text-white font-light italic mb-10">
             {HERO_SLIDES[index].title}
           </h1>
           <button 
             onClick={() => navigate('/shop')}
             className="bg-white text-heritage-charcoal px-10 py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-heritage-gold hover:text-white transition-colors duration-300"
           >
             Explore Collection
           </button>
         </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
      >
        <span className="text-[10px] uppercase tracking-widest mb-2 block">Scroll</span>
        <div className="w-[1px] h-12 bg-white/30 mx-auto"></div>
      </motion.div>
    </div>
  );
};

const NewArrivals = () => {
  const { products, loading } = useProducts();
  const navigate = useNavigate();

  // Get first 8 products for a grid that looks exactly like the reference (dense, 4 across)
  const displayProducts = products.slice(0, 8);

  return (
    <section className="py-24 px-4 md:px-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 px-2 gap-4">
        <div>
           <h2 className="font-serif text-3xl md:text-5xl text-heritage-charcoal mb-3 italic">New Arrivals</h2>
           <p className="text-gray-500 font-light text-sm tracking-wide">Fresh from the looms of Banaras</p>
        </div>
        <button onClick={() => navigate('/shop')} className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] border-b border-gray-300 pb-1 hover:border-heritage-gold transition-colors">
          View All <ArrowRight size={14} />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-sm"/>)}
        </div>
      ) : (
        // Tighter gap (gap-6) and 4 columns to match the compact reference look
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {displayProducts.map(product => (
            <ProductCard 
              key={product.id} 
              item={product}
            />
          ))}
        </div>
      )}
      
      <div className="mt-16 text-center md:hidden">
        <button onClick={() => navigate('/shop')} className="text-[10px] uppercase tracking-[0.2em] border-b border-black pb-1">View All</button>
      </div>
    </section>
  );
};

const TrustStrip = () => {
  return (
    <div className="bg-[#FAF9F6] border-t border-b border-heritage-border py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around gap-12 text-center md:text-left">
        <div className="flex items-center gap-6">
           <Gem size={28} className="text-heritage-gold" strokeWidth={1} />
           <div>
             <h4 className="font-serif text-xl">Silk Mark Certified</h4>
             <p className="text-xs text-gray-500 tracking-wide uppercase">100% Pure Silk</p>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <Leaf size={28} className="text-heritage-gold" strokeWidth={1} />
           <div>
             <h4 className="font-serif text-xl">Sustainable Craft</h4>
             <p className="text-xs text-gray-500 tracking-wide uppercase">Eco-friendly Process</p>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <ScrollText size={28} className="text-heritage-gold" strokeWidth={1} />
           <div>
             <h4 className="font-serif text-xl">Weaver Direct</h4>
             <p className="text-xs text-gray-500 tracking-wide uppercase">Fair Wages Support</p>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN HOME PAGE ---
export default function HomePage() {
  return (
    <div className="min-h-screen bg-heritage-paper font-serif text-heritage-charcoal selection:bg-heritage-gold selection:text-white">
      <SEO 
        title="Pahnawa Banaras | Luxury Handwoven Sarees" 
        description="Discover the finest Banarasi Silk Sarees, Lehengas, and Suits. Authentic handloom sourced directly from the weavers of Varanasi." 
      />
      
      <Navbar />

      <main>
        {/* 1. Cinematic Hero */}
        <CinematicHero />

        {/* 2. Shop Categories (Round/Grid style like Tilfi) */}
        <CategoryGrid />

        {/* 3. Featured Collection (Large Banner) */}
        <FeaturedCollection />

        {/* 4. New Arrivals (Product Grid) */}
        <NewArrivals />

        {/* 5. The Craft (Legacy Section) */}
        <CraftSection />

        {/* 6. Social Proof (The Muse) */}
        <MuseSection />
        
        {/* 7. Reviews */}
        <TestimonialSlider />

        {/* 8. Trust Badges */}
        <TrustStrip />
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}