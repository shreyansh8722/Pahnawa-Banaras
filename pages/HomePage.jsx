import React, { useState, useEffect, useCallback } from 'react';
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
import { ProductCard } from '@/components/shop/ProductCard'; 
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useSiteAssets } from '@/hooks/useSiteAssets'; 

// --- ICONS ---
import { ArrowRight, Gem, ScrollText, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';

// --- CINEMATIC HERO (SWIPEABLE & PRELOADED) ---
const CinematicHero = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false); 
  const navigate = useNavigate();
  const { assets } = useSiteAssets();

  // 1. Fetch Dynamic Slides
  const slides = [
    assets['hero_slide_1'],
    assets['hero_slide_2'],
    assets['hero_slide_3']
  ].filter(Boolean);

  // Fallback
  const displaySlides = slides.length > 0 ? slides : [
    "https://images.unsplash.com/photo-1610189012906-47833d772097?q=80&w=2000"
  ];

  // Preload Images
  useEffect(() => {
    displaySlides.forEach((slide) => {
      const img = new Image();
      img.src = slide;
    });
  }, [displaySlides]);

  const imageIndex = Math.abs(page % displaySlides.length);

  const paginate = useCallback((newDirection) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  // 2. Auto-Play
  useEffect(() => {
    if (displaySlides.length <= 1) return;
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [paginate, displaySlides.length]);

  // Animation Variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      zIndex: 1,
      opacity: 1, 
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 1 
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    // OPTIMIZATION: h-[85vh] on mobile prevents address bar glitch, 90vh on desktop
    <div className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden bg-gray-200 group">
      
      {!isHeroLoaded && (
        <div className="absolute inset-0 z-0 animate-pulse bg-gray-300" />
      )}

      {/* 3. SLIDER CONTAINER */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1); 
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
        >
          <img 
            src={displaySlides[imageIndex]} 
            alt="Hero Banner" 
            className="w-full h-full object-cover" 
            draggable="false"
            loading="eager" 
            fetchpriority="high"
            decoding="async"
            onLoad={() => setIsHeroLoaded(true)}
          />
          <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* 4. STATIC BUTTON */}
      {/* OPTIMIZATION: Reduced padding bottom on mobile (pb-20) */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-20 md:pb-32 pointer-events-none">
         <button 
           onClick={() => navigate('/shop')}
           className="pointer-events-auto bg-white text-heritage-charcoal px-10 py-3 md:px-12 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] hover:bg-heritage-gold hover:text-white transition-all duration-300 shadow-xl"
         >
           Explore Collection
         </button>
      </div>
      
      {/* 5. NAVIGATION DOTS */}
      {displaySlides.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {displaySlides.map((_, idx) => (
            <button
              key={idx} 
              onClick={() => {
                const newDir = idx > imageIndex ? 1 : -1;
                setPage([page + (idx - imageIndex), newDir]);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === imageIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/80'}`}
            />
          ))}
        </div>
      )}

      {/* 6. ARROWS (Hidden on mobile for cleaner look) */}
      {displaySlides.length > 1 && (
        <>
          <button 
            className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all shadow-lg"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all shadow-lg"
            onClick={() => paginate(1)}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};

const NewArrivals = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const navigate = useNavigate();
  const displayProducts = products.slice(0, 8);

  return (
    // OPTIMIZATION: Reduced vertical padding on mobile (py-12 vs py-24)
    <section className="py-12 md:py-24 px-4 md:px-12 max-w-[1600px] mx-auto">
      
      {/* OPTIMIZATION: Fixed alignment. 'items-start' keeps text left on mobile. 'md:items-end' aligns to bottom right on desktop */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 px-2 gap-4">
        <div>
           {/* OPTIMIZATION: Responsive text size */}
           <h2 className="font-serif text-3xl md:text-5xl text-heritage-charcoal mb-2 md:mb-3 italic">New Arrivals</h2>
           <p className="text-gray-500 font-light text-sm tracking-wide">Fresh from the looms of Banaras</p>
        </div>
        <button onClick={() => navigate('/shop')} className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] border-b border-gray-300 pb-1 hover:border-heritage-gold transition-colors">
          View All <ArrowRight size={14} />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-sm"/>)}
        </div>
      ) : (
        // OPTIMIZATION: Tighter gaps on mobile (gap-4 gap-y-8) to prevent wasted space
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
          {displayProducts.map(product => (
            <ProductCard 
              key={product.id} 
              item={product}
              onAddToCart={() => addToCart({ ...product, quantity: 1 })}
              isFavorite={isFavorite(product.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
      
      <div className="mt-12 text-center md:hidden">
        <button onClick={() => navigate('/shop')} className="text-xs font-bold uppercase tracking-[0.2em] border-b border-black pb-1">View All</button>
      </div>
    </section>
  );
};

const TrustStrip = () => {
  return (
    // OPTIMIZATION: Reduced padding on mobile (py-10)
    <div className="bg-[#FAF9F6] border-t border-b border-heritage-border py-10 md:py-16">
      {/* OPTIMIZATION: Reduced gap on mobile (gap-8) */}
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around gap-8 md:gap-12 text-center md:text-left">
        <div className="flex items-center gap-4 md:gap-6">
           <Gem size={28} className="text-heritage-gold" strokeWidth={1} />
           <div>
             <h4 className="font-serif text-lg md:text-xl">Silk Mark Certified</h4>
             <p className="text-[10px] md:text-xs font-bold text-gray-500 tracking-wide uppercase">100% Pure Silk</p>
           </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
           <Leaf size={28} className="text-heritage-gold" strokeWidth={1} />
           <div>
             <h4 className="font-serif text-lg md:text-xl">Sustainable Craft</h4>
             <p className="text-[10px] md:text-xs font-bold text-gray-500 tracking-wide uppercase">Eco-friendly Process</p>
           </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
           <ScrollText size={28} className="text-heritage-gold" strokeWidth={1} />
           <div>
             <h4 className="font-serif text-lg md:text-xl">Weaver Direct</h4>
             <p className="text-[10px] md:text-xs font-bold text-gray-500 tracking-wide uppercase">Fair Wages Support</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-heritage-paper font-serif text-heritage-charcoal selection:bg-heritage-gold selection:text-white">
      <SEO title="Pahnawa Banaras" description="Luxury Handwoven Sarees" />
      <Navbar />
      <main>
        <CinematicHero />
        <CategoryGrid />
        <FeaturedCollection />
        <NewArrivals />
        <CraftSection />
        <MuseSection />
        <TestimonialSlider />
        <TrustStrip />
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}