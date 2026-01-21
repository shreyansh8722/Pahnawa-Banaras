import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { CartModal } from '@/components/shop/CartModal';
import { Search, X, ArrowLeft, TrendingUp, Loader2, ShoppingBag } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/hooks/useFavorites';
import { SEO } from '@/components/SEO';

export default function SearchPage() {
  const [queryText, setQueryText] = useState('');
  const debouncedQuery = useDebounce(queryText, 300); 
  
  const [allProducts, setAllProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  // 1. Fetch products and build a "Search String" for each
  useEffect(() => {
    const fetchForSearch = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        
        const docs = snap.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            ...data,
            // Create a giant string of all searchable text for this product
            // Join name, category, color, fabric, etc.
            searchString: `
              ${data.name || ''} 
              ${data.category || ''} 
              ${data.subCategory || ''} 
              ${data.fabric || ''} 
              ${data.color || ''} 
              ${data.technique || ''}
              ${data.keywords ? data.keywords.join(' ') : ''}
            `.toLowerCase()
          };
        });
        
        setAllProducts(docs);
      } catch (err) {
        console.error("Search init failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForSearch();
  }, []);

  // 2. Smart Filtering Logic
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const lowerQuery = debouncedQuery.toLowerCase().trim();
    
    // Split query into words: "Banarasi Saree" -> ["banarasi", "saree"]
    const searchTerms = lowerQuery.split(/\s+/).filter(term => term.length > 0);

    const filtered = allProducts.filter(p => {
      // Check if EVERY search term exists SOMEWHERE in the product's data
      return searchTerms.every(term => p.searchString.includes(term));
    });

    setResults(filtered);
  }, [debouncedQuery, allProducts]);

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: 1 });
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-royal-cream font-sans text-royal-charcoal flex flex-col w-full">
      <SEO title="Search Collection - Pahnawa Banaras" />
      <Navbar />

      <div className="flex-grow pt-28 pb-20 px-4 md:px-8 w-full max-w-[1600px] mx-auto">
        
        {/* SEARCH BAR CONTAINER */}
        <div className="max-w-3xl mx-auto mb-12 sticky top-24 z-30">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-royal-gold/20 to-royal-maroon/20 rounded-sm blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-white border border-royal-border/60 rounded-sm shadow-sm p-2">
                <button onClick={() => navigate(-1)} className="md:hidden p-3 text-royal-grey">
                  <ArrowLeft size={20} />
                </button>
                <Search size={20} className="ml-4 text-royal-gold shrink-0" />
                <input
                    type="text"
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder="Search for 'Banarasi', 'Bridal', 'Red Saree'..."
                    className="w-full py-3 px-4 text-lg font-serif placeholder-royal-grey/50 focus:outline-none bg-transparent text-royal-charcoal"
                    autoFocus
                />
                {queryText && (
                    <button onClick={() => setQueryText('')} className="p-2 mr-2 text-royal-grey hover:text-royal-maroon transition-colors">
                    <X size={20} />
                    </button>
                )}
            </div>
          </div>
        </div>

        {/* RESULTS AREA */}
        <div className="min-h-[40vh]">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-royal-gold" size={32} />
                <span className="text-[10px] uppercase tracking-widest text-royal-grey">Searching Archives...</span>
             </div>
          ) : results.length > 0 ? (
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-royal-grey mb-6">
                    Found {results.length} results for "{queryText}"
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 animate-fade-in">
                {results.map(item => (
                    <ProductCard 
                        key={item.id} 
                        item={item} 
                        onAddToCart={() => handleAddToCart(item)}
                        isFavorite={isFavorite(item.id)}
                        onToggleFavorite={toggleFavorite}
                    />
                ))}
                </div>
            </div>
          ) : queryText.length > 1 ? (
             <div className="text-center py-20 bg-royal-sand/20 rounded-sm border border-dashed border-royal-border">
               <ShoppingBag size={48} className="mx-auto text-royal-border mb-4" />
               <h3 className="font-display text-2xl text-royal-charcoal mb-2">No matches found</h3>
               <p className="text-sm text-royal-grey">We couldn't find any artifacts matching "{queryText}".</p>
               <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-royal-grey py-2">Try:</span>
                  {['Silk Saree', 'Bridal Lehenga', 'Red', 'Dupatta'].map(term => (
                      <button key={term} onClick={() => setQueryText(term)} className="text-xs font-bold text-royal-maroon hover:text-royal-gold underline decoration-royal-maroon/30 underline-offset-4 px-2 py-2">
                          {term}
                      </button>
                  ))}
               </div>
             </div>
          ) : (
             // DEFAULT VIEW (SUGGESTIONS)
             <div className="max-w-2xl mx-auto mt-10">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-royal-grey mb-6 flex items-center justify-center gap-2">
                    <TrendingUp size={14} className="text-royal-gold" /> Trending Collections
                </h4>
                <div className="flex flex-wrap justify-center gap-3">
                {['Banarasi Saree', 'Bridal Lehenga', 'Pure Katan Silk', 'Organza', 'Pink Suit', 'Yellow Haldi'].map(term => (
                    <button 
                        key={term}
                        onClick={() => setQueryText(term)}
                        className="px-6 py-3 bg-white border border-royal-border rounded-full text-sm text-royal-charcoal hover:border-royal-gold hover:text-royal-maroon transition-all shadow-sm"
                    >
                        {term}
                    </button>
                ))}
                </div>
            </div>
          )}
        </div>
      </div>

      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
      <Footer />
    </div>
  );
}