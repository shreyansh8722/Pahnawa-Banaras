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
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { AppSkeleton } from '@/components/skeletons/AppSkeleton';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { favorites, toggleFavorite, loading: favoritesLoading } = useFavorites();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [favProducts, setFavProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      // 1. If no favorites, clear list and stop
      if (favorites.length === 0) {
        setFavProducts([]);
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      try {
        // 2. CHUNKING LOGIC: Firestore limits 'in' queries to 10 items.
        // We split the favorites array into chunks of 10.
        const chunks = [];
        for (let i = 0; i < favorites.length; i += 10) {
          chunks.push(favorites.slice(i, i + 10));
        }

        // 3. Fetch all chunks in parallel
        const promises = chunks.map(chunk => 
          getDocs(query(collection(db, 'products'), where(documentId(), 'in', chunk)))
        );

        const snapshots = await Promise.all(promises);
        
        // 4. Combine results from all chunks into one array
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

    if (!favoritesLoading) {
      fetchFavoriteProducts();
    }
  }, [favorites, favoritesLoading]);

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: 1 });
    setShowCart(true);
  };

  // Loading State
  if (favoritesLoading || loadingData) return <AppSkeleton />;

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col">
      <Navbar cartCount={0} onOpenCart={() => setShowCart(true)} />

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
               <div key={item.id} className="group flex flex-col">
                  <ProductCard 
                    item={item} 
                    onAddToCart={() => handleAddToCart(item)}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                  />
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="mt-2 w-full bg-white border border-gray-200 text-gray-600 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#B08D55] hover:text-white hover:border-[#B08D55] transition-all flex items-center justify-center gap-2 rounded-sm"
                  >
                     <ShoppingBag size={12} /> Move to Bag
                  </button>
               </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <CartModal />
    </div>
  );
}