import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; // Use getDoc for individual items
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites'; // Import the hook
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { CartModal } from '@/components/shop/CartModal';
import { Heart, ArrowRight } from 'lucide-react';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { favorites, toggleFavorite, loading: favoritesLoading } = useFavorites();
  const navigate = useNavigate();
  
  const [favProducts, setFavProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Fetch Product Details for Favorite IDs
  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (favorites.length === 0) {
        setFavProducts([]);
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      try {
        // Fetch all favorited products in parallel
        const productPromises = favorites.map(id => getDoc(doc(db, 'products', id)));
        const productSnaps = await Promise.all(productPromises);
        
        const products = productSnaps
          .filter(snap => snap.exists())
          .map(snap => ({ id: snap.id, ...snap.data() }));

        setFavProducts(products);
      } catch (err) {
        console.error("Error loading wishlist:", err);
      } finally {
        setLoadingData(false);
      }
    };

    if (!favoritesLoading) {
      fetchFavoriteProducts();
    }
  }, [favorites, favoritesLoading]);

  const addToCart = (item) => {
    setCart(prev => [...prev, { ...item, quantity: 1 }]);
    setShowCart(true);
  };

  // Loading State
  if (favoritesLoading || loadingData) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <Navbar cartCount={cart.length} onOpenCart={() => setShowCart(true)} />
        <div className="max-w-7xl mx-auto px-4 py-12">
           <div className="h-8 w-48 bg-gray-100 rounded mb-8 animate-pulse" />
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="aspect-[2/3] bg-gray-100 rounded-sm animate-pulse" />)}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col">
      <Navbar cartCount={cart.length} onOpenCart={() => setShowCart(true)} />

      <div className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-100 pb-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              {favProducts.length} {favProducts.length === 1 ? 'Item' : 'Items'} Saved
            </p>
          </div>
          <button onClick={() => navigate('/shop')} className="hidden md:flex items-center gap-2 text-xs font-bold text-[#B08D55] uppercase tracking-widest hover:text-black transition-colors">
            Continue Shopping <ArrowRight size={16} />
          </button>
        </div>

        {/* Content */}
        {!user ? (
          <div className="text-center py-20 bg-gray-50 rounded-sm">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-serif text-gray-900 mb-2">Please Login</h2>
            <p className="text-gray-500 text-sm mb-6">Sign in to view your saved items.</p>
            <button onClick={() => navigate('/login')} className="bg-[#B08D55] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest">
              Login Now
            </button>
          </div>
        ) : favProducts.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-serif text-xl mb-6">Your wishlist is empty</p>
            <button 
              onClick={() => navigate('/shop')}
              className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 gap-y-8 md:gap-x-8">
            {favProducts.map(item => (
              <ProductCard 
                key={item.id} 
                item={item} 
                onAddToCart={addToCart}
                isFavorite={true} // It's in the wishlist, so it's true
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
      <CartModal open={showCart} onClose={() => setShowCart(false)} cart={cart} subtotal={0} />
    </div>
  );
}