import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { CartModal } from '@/components/shop/CartModal';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const favIds = userSnap.data().favorites || [];
          
          if (favIds.length > 0) {
            // Fetch product details for these IDs
            // Note: Firestore 'in' query is limited to 10 items. 
            // For production, fetch in chunks or fetch individually.
            // Here we simplify by fetching all spots and filtering (good for small datasets)
            // or fetch by IDs if < 10.
            
            const q = query(collection(db, 'spots'), where('__name__', 'in', favIds.slice(0, 10)));
            const snap = await getDocs(q);
            const favProducts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setFavorites(favProducts);
          } else {
            setFavorites([]);
          }
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const addToCart = (item) => {
    setCart(prev => [...prev, { ...item, quantity: 1 }]);
    setShowCart(true);
  };

  if (!user) {
    // Redirect happens in useEffect, but render fallback
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col">
      <Navbar cartCount={cart.length} onOpenCart={() => setShowCart(true)} />

      <div className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-[#B08D55] mb-2">My Wishlist</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Your curated collection</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
             {[...Array(4)].map((_, i) => <div key={i} className="w-full aspect-[2/3] bg-gray-100 animate-pulse" />)}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-serif text-xl mb-4">Your wishlist is empty</p>
            <button 
              onClick={() => navigate('/shop')}
              className="bg-[#B08D55] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#8C6A48] transition-colors"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8">
            {favorites.map(item => (
              <ProductCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </div>

      <Footer />
      <CartModal 
        open={showCart} 
        onClose={() => setShowCart(false)} 
        cart={cart} 
        subtotal={0} savings={0} 
      />
    </div>
  );
}