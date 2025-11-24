import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
// ... imports ...
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { CartModal } from '@/components/shop/CartModal';
import { ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';
import LocalHeroImg from '../assets/hero.jpg';

const FALLBACK_HERO = "https://images.unsplash.com/photo-1583391726247-e29237d8612f?q=80&w=2000&auto=format&fit=crop";

const CATEGORIES = [
  { name: 'Banarasi', img: 'https://images.unsplash.com/photo-1583391726247-e29237d8612f?w=400&h=400&fit=crop' },
  { name: 'Tanchoi', img: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=400&h=400&fit=crop' },
  { name: 'Bridal', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=400&fit=crop' },
  { name: 'Lehengas', img: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&h=400&fit=crop' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // UPDATED: Fetch from 'products' collection
        const q = collection(db, 'products');
        const snap = await getDocs(q);
        setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === item.id);
      if (exists) return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
      return [...prev, { ...item, quantity: 1 }];
    });
    setShowCart(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col">
      <Navbar cartCount={cart.length} onOpenCart={() => setShowCart(true)} />

      <header className="relative w-full h-[75vh] md:h-[90vh] bg-[#F5F0EB] overflow-hidden">
        <div className="absolute inset-0">
           <img 
            src={LocalHeroImg || FALLBACK_HERO} 
            alt="Hero Banner" 
            className="w-full h-full object-cover object-top animate-fade-in"
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_HERO; }}
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
          <div className="max-w-4xl px-6 mt-16 animate-fade-in-up">
            <p className="text-white/90 text-xs md:text-sm uppercase tracking-[0.3em] mb-6 font-bold drop-shadow-md">
              The Wedding Collection 2025
            </p>
            <h2 className="text-white font-serif text-6xl md:text-9xl font-medium mb-10 leading-none drop-shadow-lg">
              Elegance Woven <br/> in Gold
            </h2>
            <button className="bg-white text-[#B08D55] px-12 py-4 uppercase tracking-widest font-bold text-xs hover:bg-[#B08D55] hover:text-white transition-all duration-300 shadow-2xl">
              Shop The Collection
            </button>
          </div>
        </div>
      </header>

      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto border-b border-gray-100">
        <div className="text-center mb-10">
          <h3 className="font-serif text-3xl text-brand-dark">Our Collections</h3>
          <div className="w-16 h-0.5 bg-[#B08D55] mx-auto mt-3"></div>
        </div>
        <div className="flex gap-8 md:gap-12 overflow-x-auto pb-8 justify-start md:justify-center scrollbar-hide px-4">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="flex flex-col items-center flex-shrink-0 group cursor-pointer">
              <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[#B08D55] p-1 transition-all duration-500">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700" />
              </div>
              <span className="mt-4 text-xs uppercase tracking-widest font-bold text-gray-600 group-hover:text-[#B08D55] transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F9F9F9] py-16 px-4 md:px-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 text-center md:text-left">
            <div>
              <h3 className="font-serif text-3xl md:text-4xl text-brand-dark mb-2">Curated For You</h3>
              <p className="text-gray-500 text-sm font-sans italic">Handpicked masterpieces fresh from our looms.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B08D55] hover:text-brand-dark transition-colors mt-4 md:mt-0 border-b border-[#B08D55] pb-1">
              View All <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
              {[...Array(4)].map((_, i) => <div key={i} className="w-full aspect-[2/3] bg-gray-200 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
              {products.slice(0, 8).map(item => (
                <ProductCard key={item.id} item={item} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <CartModal 
        open={showCart} 
        onClose={() => setShowCart(false)} 
        cart={cart} 
        subtotal={0} 
        savings={0} 
      />
    </div>
  );
}