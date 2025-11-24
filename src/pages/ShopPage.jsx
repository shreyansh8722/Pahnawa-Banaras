import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { CartModal } from '@/components/shop/CartModal';
import { Filter } from 'lucide-react';

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('cat') || 'All';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // UPDATED: Fetch from 'products' collection
        let q = collection(db, 'products');
        // Simple filtering based on URL param if not 'All'
        // Note: You need to ensure your Firestore 'products' have a 'category' field that matches these values
        if (category !== 'All' && category !== 'new') {
            // Map URL params to DB categories if needed, or ensure they match case
             // q = query(collection(db, 'products'), where('category', '==', category)); 
        }
        
        const snap = await getDocs(q);
        const allProducts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Basic client-side filter for now to handle casing differences
        const filtered = category === 'All' ? allProducts : allProducts.filter(p => 
            p.subCategory?.toLowerCase().includes(category.toLowerCase()) || 
            p.category?.toLowerCase().includes(category.toLowerCase())
        );

        setProducts(filtered); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  const addToCart = (item) => {
    setCart(prev => [...prev, { ...item, quantity: 1 }]);
    setShowCart(true);
  };

  // Helper to format category title
  const title = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col">
      <Navbar cartCount={cart.length} onOpenCart={() => setShowCart(true)} />

      {/* Page Header */}
      <div className="bg-brand-gray py-12 md:py-20 text-center px-4">
        <h1 className="font-serif text-4xl md:text-6xl text-brand-dark mb-4">{title} Collection</h1>
        <p className="text-gray-500 text-sm uppercase tracking-[0.2em]">Handwoven Elegance</p>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-24 z-30 bg-white border-b border-gray-100 py-4 px-4 md:px-8 flex justify-between items-center">
        <div className="text-sm text-gray-500">Showing {products.length} products</div>
        <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-brand-primary transition-colors">
          Filter <Filter size={16} />
        </button>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex-grow">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {[...Array(4)].map((_, i) => <div key={i} className="w-full aspect-[2/3] bg-brand-gray animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8">
            {products.map(item => (
              <ProductCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        )}
        
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-serif text-xl">No products found in this collection.</p>
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