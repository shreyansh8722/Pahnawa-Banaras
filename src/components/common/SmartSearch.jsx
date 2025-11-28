import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight, Loader2, History } from 'lucide-react';
import { collection, getDocs, query, where, limit, orderBy, startAt, endAt } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useDebounce } from '@/hooks/useDebounce';

export const SmartSearch = ({ mobile = false, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearch.trim()) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        // PERFORMANCE FIX: Prefix Search
        // Note: This requires products to be saved with a field 'searchName' (lowercase name)
        // If you don't have 'searchName', use 'name' but it will be Case Sensitive.
        // E.g., User types "ban", it finds "Banarasi". User types "ban", it misses "banarasi".
        // Best practice: Store a 'searchKeywords' array or a lowercase 'name_lower' field in Firestore.
        
        // Assuming you have 'subCategory' indexed or simple name search:
        const term = debouncedSearch.charAt(0).toUpperCase() + debouncedSearch.slice(1); // Basic Capitalization
        
        const productsRef = collection(db, 'products');
        // This query finds names starting with the term
        const q = query(
          productsRef, 
          orderBy('name'), 
          startAt(term), 
          endAt(term + '\uf8ff'), 
          limit(5)
        );

        const snap = await getDocs(q);
        const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setResults(fetched);
        setShowResults(true);

      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearch]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    navigate(`/product/${id}`);
    setShowResults(false);
    if (onClose) onClose();
  };

  return (
    <div className={`relative ${mobile ? 'w-full' : 'flex-1 max-w-md mx-8'}`} ref={searchRef}>
      <div className="relative group">
        <input 
          type="text" 
          placeholder="Search for 'Saree', 'Lehenga'..." 
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setShowResults(true); }}
          className={`w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#B08D55] rounded-full py-2.5 pl-5 pr-12 text-sm outline-none transition-all shadow-sm ${mobile ? 'rounded-lg' : ''}`}
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-400">
           {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={18} />}
        </div>
      </div>

      {showResults && (searchTerm || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
           {results.length > 0 ? (
             <div className="py-2">
                <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top Results</p>
                {results.map((product) => (
                  <div 
                    key={product.id} 
                    onClick={() => handleSelect(product.id)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                     <img src={product.featuredImageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover border border-gray-100" />
                     <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-[#B08D55] transition-colors">{product.name}</h4>
                        <p className="text-xs text-gray-500">{product.subCategory}</p>
                     </div>
                     <ChevronRight size={16} className="text-gray-300" />
                  </div>
                ))}
             </div>
           ) : !loading && searchTerm ? (
               <div className="p-8 text-center text-gray-500">
                  <p className="text-sm">No results found for "{searchTerm}"</p>
               </div>
           ) : null}
        </div>
      )}
    </div>
  );
};