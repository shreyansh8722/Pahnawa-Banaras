import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDocs, collection, query, where, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { CartModal } from '@/components/shop/CartModal';
import { Heart, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { favorites, toggleFavorite, isFavorite, loading: favoritesLoading } = useFavorites();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [favProducts, setFavProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    // Wait for auth and favorites hook to settle
    if (favoritesLoading) return;

    const fetchFavoriteProducts = async () => {
      if (favorites.length === 0) {
        setFavProducts([]);
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      try {
        const chunks = [];
        for (let i = 0; i < favorites.length; i += 10) {
          chunks.push(favorites.slice(i, i + 10));
        }

        const promises = chunks.map(chunk => 
          getDocs(query(collection(db, 'products'), where(documentId(), 'in', chunk)))
        );

        const snapshots = await Promise.all(promises);
        const products = snapshots.flatMap(snap => 
          snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        );

        setFavProducts(products);
      } catch (err) {
        console.error("Error loading wishlist:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchFavoriteProducts();
  }, [favorites, favoritesLoading]);

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: 1 });
    setCartOpen(true);
  };

  // Show loader until EVERYTHING is ready
  if (favoritesLoading || (loadingData && favorites.length > 0)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-heritage-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-serif text-heritage-charcoal flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-[1600px] mx-auto px-6 md:px-12 py-16 w-full">
        
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 border-b border-gray-100 pb-8 gap-6">
          <div className="text-center md:text-left">
            <span className="text-xs font-bold font-sans uppercase tracking-[0.2em] text-heritage-grey mb-3 block">My Collection</span>
            <h1 className="text-4xl md:text-5xl italic font-light text-heritage-charcoal">Wishlist</h1>
          </div>
          <button onClick={() => navigate('/shop')} className="hidden md:flex items-center gap-2 text-xs font-bold text-heritage-gold uppercase tracking-widest hover:text-black transition-colors">
            Continue Shopping <ArrowRight size={14} />
          </button>
        </div>

        {!user ? (
          <div className="py-32 text-center bg-heritage-sand/30 rounded-sm">
            <h2 className="text-2xl font-serif italic mb-2">Please Login</h2>
            <p className="font-sans text-sm text-heritage-grey mb-6">Sign in to view your saved masterpieces.</p>
            <button onClick={() => navigate('/login')} className="bg-heritage-charcoal text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-heritage-gold transition-colors">Login Now</button>
          </div>
        ) : favProducts.length === 0 ? (
          <div className="text-center py-32">
            <Heart size={40} className="mx-auto text-gray-200 mb-6" strokeWidth={1} />
            <h3 className="text-3xl font-serif italic text-heritage-charcoal mb-4">Your wishlist is empty.</h3>
            <p className="font-sans text-sm text-heritage-grey mb-8">Save items you love here to review them later.</p>
            <button onClick={() => navigate('/shop')} className="border-b border-heritage-charcoal pb-1 text-xs font-bold uppercase tracking-widest hover:text-heritage-gold hover:border-heritage-gold transition-colors font-sans">Start Exploring</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {favProducts.map(item => (
               <div key={item.id} className="flex flex-col gap-4">
                  <ProductCard 
                    item={item} 
                    onAddToCart={() => handleAddToCart(item)}
                    isFavorite={true} 
                    onToggleFavorite={toggleFavorite}
                  />
                  <button onClick={() => handleAddToCart(item)} className="w-full border border-gray-200 py-3 text-[10px] font-bold uppercase tracking-widest hover:border-heritage-charcoal hover:bg-heritage-charcoal hover:text-white transition-all font-sans flex items-center justify-center gap-2">
                     <ShoppingBag size={12} /> Add to Bag
                  </button>
               </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}