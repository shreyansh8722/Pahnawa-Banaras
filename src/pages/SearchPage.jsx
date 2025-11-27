import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { CartModal } from '@/components/shop/CartModal';
import { Search, X, ArrowLeft } from 'lucide-react';

export default function SearchPage() {
  const [queryText, setQueryText] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  // Fetch all products initially
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'products'));
        const snap = await getDocs(q);
        const allDocs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(allDocs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter logic
  useEffect(() => {
    if (!queryText.trim()) {
      setFilteredProducts([]);
      return;
    }
    const lowerQ = queryText.toLowerCase();
    const results = products.filter(p => 
      p.name?.toLowerCase().includes(lowerQ) || 
      p.tags_lowercase?.some(tag => tag.includes(lowerQ))
    );
    setFilteredProducts(results);
  }, [queryText, products]);

  const addToCart = (item) => {
    setCart(prev => [...prev, { ...item, quantity: 1 }]);
    setShowCart(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col w-full overflow-x-hidden">
      <Navbar cartCount={cart.length} onOpenCart={() => setShowCart(true)} />

      <div className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12 w-full">
        
        {/* Search Header - Improved for Mobile Navigation */}
        <div className="max-w-2xl mx-auto mb-10 sticky top-20 z-30 bg-white/95 backdrop-blur py-2">
          <div className="flex items-center gap-3">
            {/* Mobile Back Button */}
            <button 
              onClick={() => navigate(-1)} 
              className="md:hidden p-2 -ml-2 text-gray-500"
            >
              <ArrowLeft size={24} />
            </button>

            <div className="relative flex-grow">
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Search for sarees, lehengas..."
                className="w-full border-b-2 border-gray-200 py-3 pl-2 pr-10 text-lg font-serif placeholder-gray-300 focus:outline-none focus:border-[#B08D55] bg-transparent"
                autoFocus
              />
              {queryText ? (
                <button onClick={() => setQueryText('')} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400">
                  <X size={20} />
                </button>
              ) : (
                 <Search size={20} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300" />
              )}
            </div>

            {/* Cancel Text Button for Desktop */}
            <button 
              onClick={() => navigate('/')}
              className="hidden md:block text-sm font-bold text-gray-400 hover:text-brand-dark transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div>
          {loading ? (
             <div className="text-center py-20 text-gray-400">Searching...</div>
          ) : queryText && filteredProducts.length === 0 ? (
             <div className="text-center py-10">
               <p className="text-gray-500 mb-4">No matches found for "{queryText}"</p>
               <button onClick={() => navigate('/shop')} className="text-[#B08D55] font-bold text-xs uppercase tracking-widest border-b border-[#B08D55] pb-1">
                 View All Collections
               </button>
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 gap-y-8 md:gap-x-8">
              {filteredProducts.map(item => (
                <ProductCard key={item.id} item={item} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>

        {/* Suggestions */}
        {!queryText && !loading && (
          <div className="mt-8">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 text-center md:text-left">Trending</h4>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {['Banarasi Saree', 'Bridal Lehenga', 'Katan Silk', 'Pink Dupatta', 'Suit'].map(term => (
                <button 
                  key={term}
                  onClick={() => setQueryText(term)}
                  className="px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <CartModal open={showCart} onClose={() => setShowCart(false)} cart={cart} subtotal={0} />
    </div>
  );
}