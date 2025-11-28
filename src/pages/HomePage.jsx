import React, { useRef, useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { CartModal } from '@/components/shop/CartModal';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext'; // Using Context
import { SEO } from '@/components/SEO';
import { motion, useScroll, useTransform } from 'framer-motion';
import LocalHeroImg from '../assets/hero.webp';

const CATEGORIES = [
  { name: 'Banarasi', img: 'https://images.unsplash.com/photo-1583391726247-e29237d8612f?w=400&h=400&fit=crop' },
  { name: 'Bridal', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=400&fit=crop' },
  { name: 'Suit', img: 'https://images.unsplash.com/photo-1605902394263-66869c466503?w=400&h=400&fit=crop' },
  { name: 'Dupatta', img: 'https://images.unsplash.com/photo-1621623194266-4b3664963684?w=400&h=400&fit=crop' },
];

const FALLBACK_HERO = "https://images.unsplash.com/photo-1583391726247-e29237d8612f?q=80&w=2000&auto=format&fit=crop";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, duration: 0.8 } }
};

export default function HomePage() {
  const { products, loading } = useProducts(); // Data from Context
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  
  const { addToCart } = useCart(); 
  const { favorites, toggleFavorite } = useFavorites();

  // Parallax Logic
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    setCartOpen(true);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pahnawa Banaras",
    "url": "https://pahnawabanaras.com",
    "logo": "https://pahnawabanaras.com/logo.png"
  };

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col overflow-x-hidden">
      <SEO 
        title="Authentic Banarasi Sarees & Lehengas" 
        description="Shop the finest handwoven Banarasi silk sarees, bridal lehengas, and suits directly from Varanasi artisans. Certified purity."
        schema={schema}
      />

      <Navbar />

      {/* Parallax Hero Section */}
      <header ref={heroRef} className="relative w-full h-[75vh] md:h-[95vh] bg-[#F5F0EB] overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0">
           <img 
            src={LocalHeroImg || FALLBACK_HERO} 
            alt="Woman wearing blue Banarasi Saree on ghats" 
            className="w-full h-full object-cover object-top"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40"></div>
        </motion.div>

        <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
          <div className="max-w-4xl px-4 md:px-6 mt-16">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/90 text-xs md:text-sm uppercase tracking-[0.4em] mb-6 font-bold drop-shadow-md"
            >
              Heritage Collection 2025
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-white font-serif text-5xl md:text-8xl lg:text-9xl font-medium mb-10 leading-[1] drop-shadow-xl"
            >
              Elegance Woven <br/> <span className="italic font-light">in Gold</span>
            </motion.h1>
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/shop')} 
              className="bg-white text-[#B08D55] px-10 py-4 uppercase tracking-widest font-bold text-xs hover:bg-[#B08D55] hover:text-white transition-all duration-300 shadow-2xl rounded-sm"
            >
              Shop The Collection
            </motion.button>
          </div>
        </div>
      </header>

      {/* Collections Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-dark mb-3">Our Collections</h2>
          <div className="w-16 h-0.5 bg-[#B08D55] mx-auto"></div>
        </div>
        
        <div className="flex gap-8 md:gap-12 overflow-x-auto pb-8 justify-start md:justify-center scrollbar-hide px-6 snap-x snap-mandatory">
          {CATEGORIES.map((cat, i) => (
            <motion.button 
              key={cat.name} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center flex-shrink-0 group cursor-pointer snap-center"
              onClick={() => navigate(`/shop?cat=${cat.name.toLowerCase()}`)}
            >
              <div className="w-24 h-24 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#B08D55] p-1 transition-all duration-500">
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700" 
                />
              </div>
              <span className="mt-4 text-xs uppercase tracking-widest font-bold text-gray-600 group-hover:text-[#B08D55] transition-colors">
                {cat.name}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Curated Products Section with Staggered Grid */}
      <section className="bg-[#F9F9F9] py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-5xl text-brand-dark mb-2">Curated For You</h2>
              <p className="text-gray-500 text-sm font-sans italic">Handpicked masterpieces fresh from our looms.</p>
            </div>
            <button 
              onClick={() => navigate('/shop')} 
              className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B08D55] hover:text-brand-dark transition-colors border-b border-[#B08D55] pb-1"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[...Array(4)].map((_, i) => <div key={i} className="w-full aspect-[2/3] bg-gray-200 animate-pulse rounded-sm" />)}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-10 md:gap-8 md:gap-y-16"
            >
              {products.slice(0, 8).map(item => (
                <motion.div variants={itemVariants} key={item.id}>
                  <ProductCard 
                    item={item} 
                    onAddToCart={handleAddToCart} 
                    isFavorite={favorites.includes(item.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          <button 
            onClick={() => navigate('/shop')} 
            className="md:hidden w-full mt-12 text-xs font-bold uppercase tracking-widest text-white bg-[#B08D55] py-4 rounded-sm shadow-lg"
          >
             View All Collections
          </button>
        </div>
      </section>

      <Footer />
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}