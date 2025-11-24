import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { CartModal } from '@/components/shop/CartModal';
import { Search, X } from 'lucide-react';

export default function SearchPage() {
  const [queryText, setQueryText] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  // Fetch all products initially (Client-side search for simplicity with Firestore)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'spots'), where('category', '==', 'artifact'));
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
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col">
      <Navbar cartCount={cart.length} onOpenCart={() => setShowCart(true)} />

      <div className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
        
        {/* Search Input Area */}
        <div className="max-w-2xl mx-auto mb-16 relative">
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Search for sarees, lehengas, silk..."
            className="w-full border-b-2 border-gray-200 py-4 pl-2 pr-12 text-2xl font-serif placeholder-gray-300 focus:outline-none focus:border-[#B08D55] bg-transparent"
            autoFocus
          />
          {queryText ? (
            <button onClick={() => setQueryText('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          ) : (
             <Search size={24} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300" />
          )}
        </div>

        {/* Results */}
        <div>
          {loading ? (
             <p className="text-center text-gray-400">Loading collections...</p>
          ) : queryText && filteredProducts.length === 0 ? (
             <div className="text-center">
               <p className="text-gray-500">No matches found for "{queryText}"</p>
               <button onClick={() => navigate('/shop')} className="mt-4 text-[#B08D55] hover:underline font-bold text-sm uppercase tracking-widest">
                 Browse All Collections
               </button>
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8">
              {filteredProducts.map(item => (
                <ProductCard key={item.id} item={item} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>

        {/* Empty State / Suggestions */}
        {!queryText && !loading && (
          <div className="text-center mt-10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Popular Searches</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {['Banarasi Saree', 'Bridal Lehenga', 'Katan Silk', 'Pink Dupatta'].map(term => (
                <button 
                  key={term}
                  onClick={() => setQueryText(term)}
                  className="px-6 py-2 border border-gray-200 rounded-full text-sm text-gray-600 hover:border-[#B08D55] hover:text-[#B08D55] transition-colors"
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