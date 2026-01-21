import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, Loader2, ChevronRight, TrendingUp, AlertCircle, ShoppingBag } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';

export const SmartSearch = ({ isOpen, onClose }) => {
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]); // Cache products for instant search
  
  const debouncedQuery = useDebounce(queryText, 300);
  const navigate = useNavigate();

  // 1. Fetch Data ONCE when modal opens (Performance Optimization)
  useEffect(() => {
    if (isOpen && allProducts.length === 0) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          // Fetch last 100 products for client-side search
          const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(100));
          const snap = await getDocs(q);
          
          const products = snap.docs.map(doc => {
            const data = doc.data();
            // Create a "Searchable String" containing all relevant keywords
            const searchString = `
              ${data.name || ''} 
              ${data.category || ''} 
              ${data.subCategory || ''} 
              ${data.fabric || ''} 
              ${data.color || ''} 
              ${data.technique || ''}
              ${data.description || ''}
            `.toLowerCase();
            
            return { id: doc.id, ...data, searchString };
          });
          
          setAllProducts(products);
        } catch (error) {
          console.error("Search Data Error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isOpen]);

  // 2. The "Smart" Search Logic
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const lowerQuery = debouncedQuery.toLowerCase().trim();
    const terms = lowerQuery.split(/\s+/).filter(t => t.length > 0);

    if (terms.length === 0) return;

    // STRATEGY A: Strict Match (AND)
    // Example: "Red Saree" -> Product must have "Red" AND "Saree"
    let matches = allProducts.filter(p => 
      terms.every(term => p.searchString.includes(term))
    );

    // STRATEGY B: Loose Fallback (OR) - Handles Typos
    // Example: "Banarasi Saare" -> Strict fails. Loose finds "Banarasi" items.
    if (matches.length === 0) {
      matches = allProducts.filter(p => 
        terms.some(term => p.searchString.includes(term))
      );
    }

    setResults(matches.slice(0, 5)); // Show top 5 results
  }, [debouncedQuery, allProducts]);

  const handleClose = () => {
    setQueryText('');
    setResults([]);
    onClose();
  };

  const handleNavigate = (id) => {
    navigate(`/product/${id}`);
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Search Modal */}
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.98 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-sm shadow-2xl overflow-hidden"
          >
            {/* Input Header */}
            <div className="flex items-center border-b border-[#E6DCCA] p-4 bg-white">
              <Search className="text-[#C5A059] ml-2 shrink-0" size={22} />
              <input 
                type="text"
                placeholder="Search masterpieces (e.g. Banarasi, Red Saree)..."
                className="flex-1 px-4 py-2 text-lg bg-transparent border-none focus:outline-none text-[#2D2424] placeholder-[#6B6060]/50 font-serif"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                autoFocus
              />
              {queryText && (
                 <button onClick={() => setQueryText('')} className="mr-2 p-1 text-[#6B6060] hover:text-[#701a1a]">
                    <X size={16} />
                 </button>
              )}
              <button onClick={handleClose} className="p-2 hover:bg-[#F4F1EA] rounded-full transition-colors">
                <span className="text-xs font-bold uppercase tracking-widest text-[#6B6060]">Close</span>
              </button>
            </div>

            {/* Results Container */}
            <div className="min-h-[320px] max-h-[60vh] overflow-y-auto custom-scrollbar p-4">
               
               {/* 1. Loading State */}
               {loading && (
                  <div className="flex flex-col items-center justify-center h-40 gap-3">
                     <Loader2 className="animate-spin text-[#C5A059]" size={28} />
                     <span className="text-[10px] uppercase tracking-widest text-[#C5A059]">Accessing Archives...</span>
                  </div>
               )}

               {/* 2. Results Found */}
               {!loading && results.length > 0 && (
                  <div className="space-y-2 animate-fade-in">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-3 px-2">
                        Top Matches
                     </p>
                     {results.map(product => (
                        <div 
                           key={product.id}
                           onClick={() => handleNavigate(product.id)}
                           className="flex items-center gap-4 p-3 hover:bg-white border border-transparent hover:border-[#E6DCCA] transition-all cursor-pointer rounded-sm group"
                        >
                           <div className="w-12 h-16 bg-[#F4F1EA] shrink-0 rounded-sm overflow-hidden">
                              <img 
                                 src={product.featuredImageUrl || product.imageUrls?.[0]} 
                                 alt={product.name} 
                                 className="w-full h-full object-cover"
                              />
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className="font-serif text-[#2D2424] group-hover:text-[#701a1a] transition-colors truncate">
                                 {product.name}
                              </h4>
                              <p className="text-xs text-[#6B6060] uppercase tracking-wider">
                                 {product.category} • ₹{product.price?.toLocaleString()}
                              </p>
                           </div>
                           <ChevronRight size={16} className="text-[#E6DCCA] group-hover:text-[#701a1a]" />
                        </div>
                     ))}
                     <button 
                        onClick={() => { navigate(`/search?q=${queryText}`); handleClose(); }}
                        className="w-full py-3 mt-4 text-xs font-bold uppercase tracking-widest text-[#2D2424] bg-[#F4F1EA] hover:bg-[#2D2424] hover:text-white transition-colors"
                     >
                        View All Results
                     </button>
                  </div>
               )}

               {/* 3. No Results (Logic for Typos) */}
               {!loading && results.length === 0 && queryText.length > 1 && (
                  <div className="text-center py-12 opacity-80">
                     <AlertCircle size={32} className="mx-auto mb-3 text-[#6B6060]" />
                     <p className="font-serif text-lg text-[#2D2424]">No direct matches found.</p>
                     <p className="text-xs text-[#6B6060] mt-1 max-w-xs mx-auto">
                        We tried searching for partial matches but couldn't find anything. Try "Saree" or "Silk".
                     </p>
                  </div>
               )}

               {/* 4. Default State (Suggestions) */}
               {!loading && !queryText && (
                  <div className="mt-2 px-2">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#6B6060] mb-4 flex items-center gap-2">
                        <TrendingUp size={14} className="text-[#C5A059]" /> Trending Now
                     </h4>
                     <div className="flex flex-wrap gap-2">
                        {['Banarasi Saree', 'Bridal Lehenga', 'Red Silk', 'Katan', 'Organza', 'Suit'].map(tag => (
                           <button 
                              key={tag}
                              onClick={() => setQueryText(tag)}
                              className="px-4 py-2 bg-white border border-[#E6DCCA] text-xs text-[#2D2424] hover:border-[#C5A059] hover:text-[#701a1a] transition-colors rounded-sm"
                           >
                              {tag}
                           </button>
                        ))}
                     </div>
                  </div>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};