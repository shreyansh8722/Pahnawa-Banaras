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

  // Preload images to prevent "Text before Image" lag
  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  // Auto-Advance (5 Seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-heritage-paper font-serif text-heritage-charcoal overflow-x-hidden">
      <SEO title="Pahnawa Banaras | Authentic Handloom" description="Shop the finest Banarasi silk sarees." />
      
      <Navbar />

      {/* --- HERO SECTION: Seamless Cross-Fade --- */}
      <section className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-heritage-charcoal">
        
        {/* The Images - Absolute Positioned to Overlap */}
        <AnimatePresence initial={false}>
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }} // Smooth 1.5s fade
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-black/20 z-10" /> {/* Consistent Tint */}
            <img 
              src={HERO_SLIDES[currentSlide].image} 
              alt="Hero" 
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* The Content - Stays on top, animates gently */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, delay: 0.3 }} // Text waits 0.3s for image to start fading
              className="flex flex-col items-center"
            >
              <span className="text-[10px] md:text-xs uppercase tracking-lux mb-4 border-b border-white/50 pb-2">
                {HERO_SLIDES[currentSlide].subtitle}
              </span>
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-light italic mb-10 tracking-tight drop-shadow-2xl">
                {HERO_SLIDES[currentSlide].title}
              </h1>
            </motion.div>
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/shop')}
            className="bg-white text-heritage-charcoal px-10 py-4 text-[10px] uppercase tracking-lux hover:bg-heritage-gold hover:text-white transition-colors duration-300"
          >
            Explore Collection
          </motion.button>
        </div>
        
        {/* Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-4">
          {HERO_SLIDES.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-[2px] transition-all duration-500 ${idx === currentSlide ? 'w-12 bg-white' : 'w-4 bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* --- NARRATIVE --- */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center bg-heritage-paper">
        <span className="text-heritage-gold text-[10px] uppercase tracking-lux block mb-6">The Legacy</span>
        <h2 className="text-3xl md:text-5xl font-light leading-snug mb-8 text-heritage-charcoal">
          "We weave the history of Kashi into every yard of silk."
        </h2>
        <p className="font-sans text-sm md:text-base text-heritage-grey leading-relaxed max-w-xl mx-auto">
          From the ancient looms of Varanasi to your wardrobe. Pahnawa Banaras brings you 
          heirlooms that are crafted with patience, passion, and purity.
        </p>
      </section>

      {/* --- EDITORIAL COLLECTION GRID --- */}
      <section className="px-4 md:px-8 mb-24 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[85vh]">
          {/* Saree - Main */}
          <div onClick={() => navigate('/shop?cat=saree')} className="md:col-span-7 relative group cursor-pointer overflow-hidden h-[60vh] md:h-full">
            <img src="https://images.unsplash.com/photo-1610189012906-47833d772097?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-1000" />
            <div className="absolute bottom-10 left-10 text-white z-10">
              <h3 className="text-5xl italic font-light mb-2">The Sari</h3>
              <span className="text-[10px] uppercase tracking-lux underline underline-offset-4">Explore Drapes</span>
            </div>
          </div>
          {/* Side Stack */}
          <div className="md:col-span-5 flex flex-col gap-4 h-full">
            <div onClick={() => navigate('/shop?cat=lehenga')} className="relative flex-1 group cursor-pointer overflow-hidden h-[40vh] md:h-auto">
              <img src="https://images.unsplash.com/photo-1583391726247-e29237d8612f?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-1000" />
              <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                <h3 className="text-4xl italic font-light">Bridal</h3>
              </div>
            </div>
            <div onClick={() => navigate('/shop?cat=suit')} className="relative flex-1 group cursor-pointer overflow-hidden h-[40vh] md:h-auto">
              <img src="https://images.unsplash.com/photo-1621623194266-4b3664963684?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-1000" />
              <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                 <h3 className="text-4xl italic font-light">Unstitched</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRODUCTS SECTION --- */}
      <section className="bg-heritage-sand py-24 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-4xl italic font-light mb-4">Curated Masterpieces</h2>
            <div className="w-12 h-[1px] bg-heritage-charcoal/30"></div>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">{[...Array(4)].map((_, i) => <div key={i} className="w-full aspect-[2/3] bg-gray-200 animate-pulse" />)}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8">
              {products.slice(0, 8).map(item => (
                <ProductCard 
                  key={item.id} item={item} 
                  onAddToCart={() => handleAddToCart(item)} 
                  isFavorite={favorites.includes(item.id)} onToggleFavorite={toggleFavorite} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}