import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { CartModal } from '@/components/shop/CartModal';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useProducts } from '@/context/ProductContext';
import { SEO } from '@/components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

// Assets
import HeroImg1 from '@/assets/hero1.webp';
import HeroImg2 from '@/assets/hero2.webp';
import HeroImg3 from '@/assets/hero3.webp';

const HERO_SLIDES = [
  {
    id: 1,
    image: HeroImg1,
    title: "The Golden Loom",
    subtitle: "Authentic Handwoven Banarasis"
  },
  {
    id: 2,
    image: HeroImg2,
    title: "Weaving Heritage",
    subtitle: "From the Ghats of Kashi"
  },
  {
    id: 3,
    image: HeroImg3,
    title: "Timeless Elegance",
    subtitle: "Silk Mark Certified Pure Silk"
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart(); 
  const { favorites, toggleFavorite } = useFavorites();
  const { products, loading: productsLoading } = useProducts();
  const [cartOpen, setCartOpen] = useState(false);
  
  // --- SMOOTH SLIDESHOW STATE ---
  const [currentSlide, setCurrentSlide] = useState(0);

  // Preload images
  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  // Auto-Advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    setCartOpen(true);
  };

  return (
    // FIX: Removed 'overflow-x-hidden' from here. It breaks sticky headers.
    // If you need to prevent horizontal scroll, ensure it's handled in index.css on 'body'.
    <div className="min-h-screen bg-heritage-paper font-serif text-heritage-charcoal">
      <SEO title="Pahnawa Banaras | Authentic Handloom" description="Shop the finest Banarasi silk sarees." />
      
      <Navbar />

      {/* --- HERO SECTION: Cinematic Cross-Fade --- */}
      <section className="relative h-[90vh] w-full overflow-hidden bg-heritage-charcoal">
        
        {/* Images with Ken Burns Effect */}
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-black/30 z-10" /> 
            <img 
              src={HERO_SLIDES[currentSlide].image} 
              alt="Hero" 
              className="w-full h-full object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>

        {/* Text Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(5px)' }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] mb-6 border-b border-white/40 pb-3">
                {HERO_SLIDES[currentSlide].subtitle}
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-9xl font-light italic mb-12 tracking-tight drop-shadow-xl leading-none">
                {HERO_SLIDES[currentSlide].title}
              </h1>
            </motion.div>
          </AnimatePresence>

          <motion.button 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/shop')}
            className="bg-white/10 backdrop-blur-sm border border-white/50 text-white px-12 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-heritage-charcoal transition-all duration-500"
          >
            Explore Collection
          </motion.button>
        </div>
        
        {/* Progress Bar Indicators */}
        <div className="absolute bottom-12 left-12 z-30 flex items-center gap-4">
          <span className="text-white/60 text-[10px] font-sans">0{currentSlide + 1}</span>
          <div className="w-24 h-[1px] bg-white/20 relative overflow-hidden">
             <motion.div 
               key={currentSlide}
               initial={{ x: '-100%' }}
               animate={{ x: '0%' }}
               transition={{ duration: 6, ease: "linear" }}
               className="absolute inset-0 bg-white"
             />
          </div>
          <span className="text-white/60 text-[10px] font-sans">0{HERO_SLIDES.length}</span>
        </div>
      </section>

      {/* --- BRAND MANIFESTO --- */}
      <section className="py-32 px-6 md:px-12 max-w-5xl mx-auto text-center bg-heritage-paper">
        <span className="text-heritage-gold text-[10px] uppercase tracking-[0.2em] block mb-8">The Legacy</span>
        <h2 className="text-3xl md:text-5xl font-light leading-snug mb-10 text-heritage-charcoal italic">
          "We weave the ancient history of Kashi into every yard of silk, creating heirlooms for the modern bride."
        </h2>
        <p className="font-sans text-sm md:text-[15px] text-heritage-grey leading-loose max-w-2xl mx-auto font-light">
          From the ancient looms of Varanasi to your wardrobe. Pahnawa Banaras brings you 
          textiles that are crafted with patience, passion, and purity. Each piece is a testament to the artisan's skill, designed to be cherished for generations.
        </p>
      </section>

      {/* --- EDITORIAL COLLECTION GRID --- */}
      <section className="px-4 md:px-8 mb-32 max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[90vh]">
          {/* Main Feature */}
          <div onClick={() => navigate('/shop?cat=saree')} className="md:col-span-8 relative group cursor-pointer overflow-hidden h-[60vh] md:h-full">
            <img src="https://images.unsplash.com/photo-1610189012906-47833d772097?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" alt="Saree" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="absolute bottom-12 left-12 text-white z-10">
              <span className="text-[10px] uppercase tracking-widest block mb-2">The Classics</span>
              <h3 className="text-5xl md:text-7xl italic font-light mb-4">The Banarasi Sari</h3>
              <span className="text-[10px] uppercase tracking-lux underline underline-offset-8 decoration-white/50 group-hover:decoration-white transition-all">Explore Drapes</span>
            </div>
          </div>
          
          {/* Side Stack */}
          <div className="md:col-span-4 flex flex-col gap-6 h-full">
            <div onClick={() => navigate('/shop?cat=lehenga')} className="relative flex-1 group cursor-pointer overflow-hidden h-[45vh] md:h-auto">
              <img src="https://images.unsplash.com/photo-1583391726247-e29237d8612f?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" alt="Bridal" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-1000" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                <h3 className="text-4xl italic font-light">Bridal</h3>
                <span className="text-[9px] uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">Handwoven Lehengas</span>
              </div>
            </div>
            <div onClick={() => navigate('/shop?cat=suit')} className="relative flex-1 group cursor-pointer overflow-hidden h-[45vh] md:h-auto">
              <img src="https://images.unsplash.com/photo-1621623194266-4b3664963684?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" alt="Suits" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-1000" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                 <h3 className="text-4xl italic font-light">Unstitched</h3>
                 <span className="text-[9px] uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">Suits & Fabrics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRODUCTS SECTION --- */}
      <section className="bg-heritage-sand/30 py-32 px-4 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col items-center mb-20 text-center">
            <span className="text-[10px] text-heritage-gold uppercase tracking-[0.2em] mb-4">Curated For You</span>
            <h2 className="text-4xl md:text-5xl italic font-light text-heritage-charcoal">New Masterpieces</h2>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">{[...Array(4)].map((_, i) => <div key={i} className="w-full aspect-[2/3] bg-gray-100 animate-pulse" />)}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-16 md:gap-x-10">
              {products.slice(0, 8).map(item => (
                <ProductCard 
                  key={item.id} item={item} 
                  onAddToCart={() => handleAddToCart(item)} 
                  isFavorite={favorites.includes(item.id)} onToggleFavorite={toggleFavorite} 
                />
              ))}
            </div>
          )}
          
          <div className="mt-20 text-center">
             <button onClick={() => navigate('/shop')} className="border-b border-heritage-charcoal text-heritage-charcoal pb-1 text-[10px] uppercase tracking-[0.2em] hover:text-heritage-gold hover:border-heritage-gold transition-colors">
               View All Collections
             </button>
          </div>
        </div>
      </section>

      <WhatsAppButton />
      <Footer />
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}