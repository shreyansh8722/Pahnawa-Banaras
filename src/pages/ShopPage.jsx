import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { CartModal } from '@/components/shop/CartModal'; // Import global modal just in case
import { Filter } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/context/CartContext';
import { SEO } from '@/components/SEO';

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('cat') || 'All';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = collection(db, 'products');
        const snap = await getDocs(q);
        const allProducts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // ROBUST FILTERING LOGIC
        const filtered = categoryParam === 'All' ? allProducts : allProducts.filter(p => {
            // Convert all to lowercase for comparison
            const searchCat = categoryParam.toLowerCase();
            // "sarees" -> "saree" (singularize for better matching)
            const searchSingular = searchCat.endsWith('s') ? searchCat.slice(0, -1) : searchCat;
            
            const pCat = (p.category || '').toLowerCase();
            const pSubCat = (p.subCategory || '').toLowerCase();
            
            return pCat.includes(searchCat) || 
                   pCat.includes(searchSingular) ||
                   pSubCat.includes(searchCat) ||
                   pSubCat.includes(searchSingular);
        });

        setProducts(filtered); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryParam]);

  const title = categoryParam === 'All' ? 'All Collections' : categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col">
      <SEO title={`${title} - Pahnawa Banaras`} />
      <Navbar />

      {/* Page Header */}
      <div className="bg-brand-gray py-12 md:py-20 text-center px-4">
        <h1 className="font-serif text-4xl md:text-6xl text-brand-dark mb-4">{title}</h1>
        <p className="text-gray-500 text-sm uppercase tracking-[0.2em]">Handwoven Elegance</p>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-[60px] md:top-[80px] z-30 bg-white border-b border-gray-100 py-4 px-4 md:px-8 flex justify-between items-center shadow-sm">
        <div className="text-sm text-gray-500">Showing {products.length} products</div>
        <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-brand-primary transition-colors">
          Filter <Filter size={16} />
        </button>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex-grow w-full">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {[...Array(8)].map((_, i) => <div key={i} className="w-full aspect-[2/3] bg-gray-100 animate-pulse rounded-sm" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8">
            {products.map(item => (
              <ProductCard 
                key={item.id} 
                item={item} 
                onAddToCart={() => addToCart(item)}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
        
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-serif text-xl mb-4">No products found in {title}.</p>
            <button onClick={() => navigate('/shop')} className="text-[#B08D55] underline uppercase tracking-widest text-xs">View All</button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}