import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { CartModal } from '@/components/shop/CartModal';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/context/CartContext';
import { SEO } from '@/components/SEO'; // Import SEO
import LocalHeroImg from '../assets/hero.webp';

const CATEGORIES = [
  { name: 'Banarasi', img: 'https://images.unsplash.com/photo-1583391726247-e29237d8612f?w=400&h=400&fit=crop' },
  { name: 'Bridal', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=400&fit=crop' },
  { name: 'Suit', img: 'https://images.unsplash.com/photo-1605902394263-66869c466503?w=400&h=400&fit=crop' },
  { name: 'Dupatta', img: 'https://images.unsplash.com/photo-1621623194266-4b3664963684?w=400&h=400&fit=crop' },
];

const FALLBACK_HERO = "https://images.unsplash.com/photo-1583391726247-e29237d8612f?q=80&w=2000&auto=format&fit=crop";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const { addToCart } = useCart(); 
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(8));
        const snap = await getDocs(q);
        if (!snap.empty) {
           setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
           // Fallback
           const fallbackQ = collection(db, 'products');
           const fallbackSnap = await getDocs(fallbackQ);
           const allDocs = fallbackSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
           setProducts(allDocs.slice(0, 8));
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // JSON-LD Schema for Google
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pahnawa Banaras",
    "url": "https://pahnawabanaras.com",
    "logo": "https://pahnawabanaras.com/logo.png",
    "sameAs": [
      "https://www.instagram.com/pahnawabanaras",
      "https://www.facebook.com/pahnawabanaras"
    ]
  };

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col overflow-x-hidden">
      <SEO 
        title="Authentic Banarasi Sarees & Lehengas" 
        description="Shop the finest handwoven Banarasi silk sarees, bridal lehengas, and suits directly from Varanasi artisans. Certified purity."
        schema={schema}
      />

      <Navbar />

      <header className="relative w-full h-[65vh] md:h-[90vh] bg-[#F5F0EB] overflow-hidden">
        <div className="absolute inset-0">
           <img 
            src={LocalHeroImg || FALLBACK_HERO} 
            alt="Woman wearing blue Banarasi Saree on ghats" // Descriptive Alt Text for Accessibility
            className="w-full h-full object-cover object-top"
            // Performance Optimization:
            fetchPriority="high"
            decoding="async"
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_HERO; }}
          />
          <div className="absolute inset-0 bg-black/30 md:bg-black/20"></div>
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
          <div className="max-w-4xl px-4 md:px-6 mt-8 md:mt-16">
            <p className="text-white/90 text-[10px] md:text-sm uppercase tracking-[0.3em] mb-4 md:mb-6 font-bold drop-shadow-md">
              The Wedding Collection 2025
            </p>
            <h1 className="text-white font-serif text-4xl md:text-7xl lg:text-8xl font-medium mb-6 md:mb-10 leading-[1.1] drop-shadow-lg">
              Elegance Woven <br/> in Gold
            </h1>
            <button 
              onClick={() => navigate('/shop')} 
              className="bg-white text-[#B08D55] px-8 py-3 md:px-12 md:py-4 uppercase tracking-widest font-bold text-[10px] md:text-xs hover:bg-[#B08D55] hover:text-white transition-all duration-300 shadow-2xl rounded-sm"
              aria-label="Shop the collection"
            >
              Shop The Collection
            </button>
          </div>
        </div>
      </header>

      <section className="py-10 md:py-16 max-w-7xl mx-auto border-b border-gray-100 w-full" aria-label="Collections">
        <div className="text-center mb-8 md:mb-10 px-4">
          <h2 className="font-serif text-2xl md:text-3xl text-brand-dark">Our Collections</h2>
          <div className="w-12 md:w-16 h-0.5 bg-[#B08D55] mx-auto mt-3"></div>
        </div>
        
        <div 
          className="flex gap-6 md:gap-12 overflow-x-auto pb-8 pt-2 justify-start md:justify-center scrollbar-hide px-6 snap-x snap-mandatory overscroll-x-contain"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
        >
          {CATEGORIES.map((cat) => (
            <button 
              key={cat.name} 
              className="flex flex-col items-center flex-shrink-0 group cursor-pointer min-w-[80px] snap-center bg-transparent border-none"
              onClick={() => navigate(`/shop?cat=${cat.name.toLowerCase()}`)}
              aria-label={`View ${cat.name} collection`}
            >
              <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[#B08D55] p-1 transition-all duration-500 shadow-sm">
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700" 
                  loading="lazy"
                />
              </div>
              <span className="mt-3 md:mt-4 text-[10px] md:text-xs uppercase tracking-widest font-bold text-gray-600 group-hover:text-[#B08D55] transition-colors">
                {cat.name}
              </span>
            </button>
          ))}
          <div className="w-2 flex-shrink-0 md:hidden"></div>
        </div>
      </section>

      <section className="bg-[#F9F9F9] py-10 md:py-16 px-4 md:px-8 flex-grow" aria-label="Curated Products">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 md:mb-10 text-center md:text-left">
            <div className="w-full md:w-auto">
              <h2 className="font-serif text-2xl md:text-4xl text-brand-dark mb-2">Curated For You</h2>
              <p className="text-gray-500 text-xs md:text-sm font-sans italic">Handpicked masterpieces fresh from our looms.</p>
            </div>
            <button 
              onClick={() => navigate('/shop')} 
              className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B08D55] hover:text-brand-dark transition-colors mt-4 md:mt-0 border-b border-[#B08D55] pb-1"
              aria-label="View all curated products"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
              {[...Array(4)].map((_, i) => <div key={i} className="w-full aspect-[2/3] bg-gray-200 animate-pulse rounded-sm" />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 gap-y-6 md:gap-x-8 md:gap-y-12">
              {products.map(item => (
                <ProductCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={addToCart} 
                  isFavorite={favorites.includes(item.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400 bg-white rounded-sm border border-gray-100">
               <p>No products visible.</p>
            </div>
          )}
          
          <button 
            onClick={() => navigate('/shop')} 
            className="md:hidden w-full mt-8 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B08D55] border border-[#B08D55] py-3.5 rounded-sm hover:bg-[#B08D55] hover:text-white transition-colors"
          >
             View All Collections
          </button>
        </div>
      </section>

      <Footer />
      {/* Global Cart is in main.jsx wrapper */}
    </div>
  );
}