import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { CartModal } from '@/components/shop/CartModal';
import { TestimonialSlider } from '@/components/home/TestimonialSlider';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import { SEO } from '@/components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// --- LOCAL FALLBACK IMAGES ---
import HeroImg1 from '../assets/hero1.webp';
import HeroImg2 from '../assets/hero2.webp';
import HeroImg3 from '../assets/hero3.webp';

const FALLBACK_SLIDES = [
  {
    id: 'local-1',
    image: HeroImg1,
    title: 'Elegance Woven in Gold',
    subtitle: 'Heritage Collection 2025',
    link: '/shop?cat=saree',
    buttonText: 'Shop Sarees'
  },
  {
    id: 'local-2',
    image: HeroImg2,
    title: 'The Royal Bride',
    subtitle: 'Handcrafted Banarasi Lehengas',
    link: '/shop?cat=lehenga',
    buttonText: 'View Lehengas'
  },
  {
    id: 'local-3',
    image: HeroImg3,
    title: 'Timeless Silks',
    subtitle: 'Authentic Varanasi Weaves',
    link: '/shop',
    buttonText: 'Shop All'
  }
];

const CATEGORIES = [
  { name: 'Banarasi', img: 'https://images.unsplash.com/photo-1583391726247-e29237d8612f?w=400&h=400&fit=crop' },
  { name: 'Bridal', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=400&fit=crop' },
  { name: 'Suit', img: 'https://images.unsplash.com/photo-1605902394263-66869c466503?w=400&h=400&fit=crop' },
  { name: 'Dupatta', img: 'https://images.unsplash.com/photo-1621623194266-4b3664963684?w=400&h=400&fit=crop' },
];

export default function HomePage() {
  const { products, loading: productsLoading } = useProducts();
  const [cartOpen, setCartOpen] = useState(false);
  
  // Slider State
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadingSlides, setLoadingSlides] = useState(true);

  const navigate = useNavigate();
  const { addToCart } = useCart(); 
  const { favorites, toggleFavorite } = useFavorites();

  // 1. Fetch Slides from Firebase (Admin Controlled)
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const q = query(collection(db, 'hero_slides'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const fetchedSlides = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setSlides(fetchedSlides);
        }
      } catch (err) {
        console.error("Failed to fetch slides, using fallback", err);
      } finally {
        setLoadingSlides(false);
      }
    };
    fetchSlides();
  }, []);

  // 2. Auto-Play Logic
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    setCartOpen(true);
  };

  const currentHero = slides[currentSlide];

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col overflow-x-hidden">
      <SEO 
        title="Pahnawa Banaras | Authentic Handwoven Silk" 
        description="Shop the finest Banarasi silk sarees and lehengas directly from Varanasi."
      />

      <Navbar />

      {/* --- DYNAMIC HERO SLIDER (FIXED) --- */}
      <header className="relative w-full h-[75vh] md:h-[95vh] bg-[#F5F0EB] overflow-hidden group">
        {loadingSlides ? (
           <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
             <Loader2 className="animate-spin text-[#B08D55]" size={40} />
           </div>
        ) : (
          <AnimatePresence initial={false}>
            <motion.div 
              key={currentHero.id || currentSlide}
              // Stack order manages visibility to prevent "white flash"
              initial={{ opacity: 0, scale: 1.1, zIndex: 1 }}
              animate={{ opacity: 1, scale: 1, zIndex: 2 }}
              exit={{ opacity: 0, zIndex: 0 }}
              transition={{ 
                duration: 1.5, 
                ease: [0.25, 0.1, 0.25, 1.0] // Luxury ease curve
              }}
              className="absolute inset-0"
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/30 z-10" />
              
              <img 
                src={currentHero.image} 
                alt={currentHero.title} 
                className="w-full h-full object-cover object-top"
              />
              
              <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
                  <div className="max-w-4xl px-4 md:px-6 mt-16">
                    <motion.p 
                      initial={{ y: 20, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }} 
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="text-white/90 text-xs md:text-sm uppercase tracking-[0.4em] mb-4 font-bold drop-shadow-md"
                    >
                      {currentHero.subtitle}
                    </motion.p>
                    <motion.h1 
                      initial={{ y: 30, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }} 
                      transition={{ delay: 1, duration: 0.8 }}
                      className="text-white font-serif text-4xl md:text-7xl lg:text-9xl font-medium mb-10 leading-[1.1] drop-shadow-xl"
                    >
                      {currentHero.title}
                    </motion.h1>
                    <motion.button 
                      initial={{ y: 20, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }} 
                      transition={{ delay: 1.2, duration: 0.8 }}
                      onClick={() => navigate(currentHero.link || '/shop')} 
                      className="bg-white text-[#B08D55] px-10 py-4 uppercase tracking-widest font-bold text-xs hover:bg-[#B08D55] hover:text-white transition-all duration-300 shadow-2xl rounded-sm"
                    >
                      {currentHero.buttonText || 'Shop The Collection'}
                    </motion.button>
                  </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        
        {/* Controls */}
        {slides.length > 1 && (
          <>
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 text-white/50 hover:text-white border border-white/20 hover:border-white rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 text-white/50 hover:text-white border border-white/20 hover:border-white rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm">
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </>
        )}
      </header>

      {/* --- CATEGORIES --- */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-dark mb-3">Our Collections</h2>
          <div className="w-16 h-0.5 bg-[#B08D55] mx-auto"></div>
        </div>
        <div className="flex gap-8 md:gap-12 overflow-x-auto pb-8 justify-start md:justify-center scrollbar-hide px-6 snap-x snap-mandatory">
          {CATEGORIES.map((cat, i) => (
            <motion.button 
              key={cat.name} 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center flex-shrink-0 group cursor-pointer snap-center"
              onClick={() => navigate(`/shop?cat=${cat.name.toLowerCase()}`)}
            >
              <div className="w-24 h-24 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#B08D55] p-1 transition-all duration-500">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700" />
              </div>
              <span className="mt-4 text-xs uppercase tracking-widest font-bold text-gray-600 group-hover:text-[#B08D55] transition-colors">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* --- CURATED PRODUCTS --- */}
      <section className="bg-[#F9F9F9] py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-5xl text-brand-dark mb-2">Curated For You</h2>
              <p className="text-gray-500 text-sm font-sans italic">Handpicked masterpieces fresh from our looms.</p>
            </div>
            <button onClick={() => navigate('/shop')} className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B08D55] hover:text-brand-dark transition-colors border-b border-[#B08D55] pb-1">
              View All <ArrowRight size={16} />
            </button>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">{[...Array(4)].map((_, i) => <div key={i} className="w-full aspect-[2/3] bg-gray-200 animate-pulse rounded-sm" />)}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-10 md:gap-8 md:gap-y-16">
              {products.slice(0, 8).map(item => (
                <ProductCard 
                  key={item.id} item={item} 
                  onAddToCart={() => handleAddToCart(item)} 
                  isFavorite={favorites.includes(item.id)} onToggleFavorite={toggleFavorite} 
                />
              ))}
            </div>
          )}
          <button onClick={() => navigate('/shop')} className="md:hidden w-full mt-12 text-xs font-bold uppercase tracking-widest text-white bg-[#B08D55] py-4 rounded-sm shadow-lg">View All Collections</button>
        </div>
      </section>

      <TestimonialSlider />
      <Footer />
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}