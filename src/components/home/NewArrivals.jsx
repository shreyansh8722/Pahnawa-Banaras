import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Ensure this path matches your firebase config
import { ProductCard } from '@/components/shop/ProductCard';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/hooks/useFavorites';

export const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cart & Wishlist Hooks to pass to ProductCard
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchNewest = async () => {
      try {
        setLoading(true);
        // Query: Get 4 most recently created products
        const productsRef = collection(db, 'products');
        const q = query(productsRef, orderBy('createdAt', 'desc'), limit(4));
        const snapshot = await getDocs(q);
        
        const fetchedProducts = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        }));
        
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewest();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center bg-royal-cream">
        <Loader2 className="animate-spin text-royal-gold" size={32} />
      </div>
    );
  }

  // Hide section if no products in DB
  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-royal-cream border-t border-royal-gold/10">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-royal-gold">Just In</span>
            <h2 className="font-display text-4xl text-royal-charcoal mt-2">Latest Masterpieces</h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-royal-maroon hover:text-royal-charcoal transition-colors duration-200">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              item={product}
              onAddToCart={() => addToCart({...product, quantity: 1})}
              isFavorite={isFavorite(product.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
        
        {/* Mobile View All */}
        <div className="mt-12 text-center md:hidden">
            <Link to="/shop" className="inline-block border-b border-royal-maroon pb-1 text-xs font-bold uppercase tracking-widest text-royal-maroon">
                View All Arrivals
            </Link>
        </div>
      </div>
    </section>
  );
};