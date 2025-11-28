import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight, Loader2 } from 'lucide-react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useDebounce } from '@/hooks/useDebounce'; // You likely have this hook, if not I'll provide it

export const SmartSearch = ({ mobile = false, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
  // Debounce search to save database reads
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearch.trim()) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        // Note: Firestore doesn't support native partial text search effectively.
        // For a real production app with 1000+ items, use Algolia or Typesense.
        // For now, we'll fetch all and filter client-side (efficient for < 500 products)
        // OR search by exact prefix if you prefer.
        
        const q = query(collection(db, 'products')); // Get all for client-side filtering
        const snap = await getDocs(q);
        const allDocs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const filtered = allDocs.filter(p => 
           p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
           p.subCategory?.toLowerCase().includes(debouncedSearch.toLowerCase())
        ).slice(0, 5); // Limit to 5 suggestions

        setResults(filtered);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearch]);

  const handleSelect = (id) => {
    navigate(`/product/${id}`);
    setShowResults(false);
    setSearchTerm('');
    if (onClose) onClose();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowResults(false);
      setSearchTerm('');
      if (onClose) onClose();
    }
  };

  return (
    <div className={`relative ${mobile ? 'w-full' : 'flex-1 max-w-md mx-8'}`} ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative group">
        <input 
          type="text" 
          placeholder="Search for sarees, lehengas..." 
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
          className={`w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:border-[#B08D55] focus:bg-white transition-all ${mobile ? 'rounded-lg' : ''}`}
        />
        <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-[#B08D55] transition-colors">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={18} />}
        </button>
      </form>

      {/* Dropdown Results */}
      {showResults && searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
           {results.length > 0 ? (
             <div className="py-2">
                <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Suggestions</p>
                {results.map((product) => (
                  <div 
                    key={product.id} 
                    onClick={() => handleSelect(product.id)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                     <img src={product.featuredImageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover border border-gray-100" />
                     <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                        <p className="text-xs text-gray-500">{product.subCategory}</p>
                     </div>
                     <ChevronRight size={16} className="text-gray-300" />
                  </div>
                ))}
                <button 
                  onClick={handleSearchSubmit}
                  className="w-full text-center py-3 text-xs font-bold text-[#B08D55] border-t border-gray-100 hover:bg-gray-50 transition-colors uppercase tracking-widest"
                >
                  View All {results.length}+ Results
                </button>
             </div>
           ) : (
             !loading && (
               <div className="p-6 text-center text-gray-500 text-sm">
                  No products found for "{searchTerm}"
               </div>
             )
           )}
        </div>
      )}
    </div>
  );
};