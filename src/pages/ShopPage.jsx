import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductCard } from '@/components/shop/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/hooks/useFavorites';
import { SlidersHorizontal, ChevronDown, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '@/components/SEO';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeSort, setActiveSort] = useState('newest');
  
  // Filter State
  const [activeFilters, setActiveFilters] = useState({});

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const location = useLocation();

  // 1. Initial Data Fetch
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Sync URL Params (e.g. ?cat=sarees)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');
    
    if (cat) {
      const categoryName = cat.charAt(0).toUpperCase() + cat.slice(1);
      setActiveFilters(prev => ({ ...prev, "Category": [categoryName] }));
    }
  }, [location.search]);

  // 3. Robust Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    Object.entries(activeFilters).forEach(([group, selectedValues]) => {
      if (selectedValues && selectedValues.length > 0) {
        result = result.filter(product => {
          // Normalize Data safely
          const pData = {
            category: (product.category || "").toLowerCase(),
            subCategory: (product.subCategory || "").toLowerCase(),
            color: (product.color || "").toLowerCase(),
            fabric: (product.fabric || "").toLowerCase(),
            occasion: (product.occasion || "").toLowerCase(),
            technique: (product.technique || product.weave || "").toLowerCase()
          };

          // Filter Check Helper (Bi-directional)
          const matches = (dataValue, filterValues) => {
             return filterValues.some(fVal => {
                const f = fVal.toLowerCase();
                const d = dataValue;
                return d.includes(f) || f.includes(d);
             });
          };

          if (group === "Category") {
             return matches(pData.category, selectedValues) || matches(pData.subCategory, selectedValues);
          }
          if (group === "Color") return matches(pData.color, selectedValues);
          if (group === "Fabric") return matches(pData.fabric, selectedValues);
          if (group === "Occasion") return matches(pData.occasion, selectedValues);
          if (group === "Craft") return matches(pData.technique, selectedValues);
          
          return true;
        });
      }
    });

    // Sort Logic
    if (activeSort === 'price-low') {
        result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (activeSort === 'price-high') {
        result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } 

    return result;
  }, [products, activeFilters, activeSort]);

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: 1 });
    // Note: CartModal is now handled globally in Layout, so we don't need local state for it
  };

  const removeFilter = (group, value) => {
    setActiveFilters(prev => {
      const updated = prev[group].filter(item => item !== value);
      if (updated.length === 0) {
        const { [group]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [group]: updated };
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2424] font-sans selection:bg-[#C5A059] selection:text-white">
      <SEO title="Shop Collection - Pahnawa Banaras" />
      
      {/* NAVBAR REMOVED - Handled by Layout */}

      <div className="pt-8 pb-12 md:pb-20 max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        
        {/* HEADER CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-[#E6DCCA]/60 pb-6 gap-6">
          <div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059] mb-2 block">
              Heritage Collection
            </span>
            <h1 className="text-3xl md:text-5xl font-display text-[#2D2424]">
              All Masterpieces
            </h1>
            <p className="text-xs text-[#6B6060] mt-2 font-serif italic">
              Showing {filteredProducts.length} artifacts
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={() => setFiltersOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-[#2D2424] text-[10px] font-bold uppercase tracking-widest hover:bg-[#2D2424] hover:text-white transition-all duration-300 rounded-sm"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            
            <div className="relative group flex-1 md:flex-none z-30">
              <button className="w-full flex items-center justify-between gap-2 px-6 py-3 bg-[#F4F1EA] border border-transparent hover:border-[#C5A059]/30 text-[10px] font-bold uppercase tracking-widest min-w-[180px] rounded-sm transition-all">
                <span className="truncate">Sort: {activeSort.replace('-', ' ')}</span>
                <ChevronDown size={14} />
              </button>
              
              <div className="absolute top-full right-0 w-full bg-white shadow-xl border border-[#E6DCCA] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-1 rounded-sm overflow-hidden z-50">
                 {[
                    { label: 'Newest First', value: 'newest' },
                    { label: 'Price: Low to High', value: 'price-low' },
                    { label: 'Price: High to Low', value: 'price-high' }
                 ].map(option => (
                   <button 
                     key={option.value} 
                     onClick={() => setActiveSort(option.value)}
                     className={`block w-full text-left px-4 py-3 text-xs hover:bg-[#F4F1EA] hover:text-[#701a1a] transition-colors ${activeSort === option.value ? 'bg-[#F4F1EA] text-[#701a1a] font-bold' : 'text-[#6B6060]'}`}
                   >
                     {option.label}
                   </button>
                 ))}
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE FILTERS TAGS */}
        {Object.values(activeFilters).flat().length > 0 && (
           <div className="flex flex-wrap gap-2 mb-8 animate-fade-in">
              {Object.entries(activeFilters).map(([group, values]) => 
                 values.map(val => (
                    <button 
                      key={`${group}-${val}`}
                      onClick={() => removeFilter(group, val)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F1EA] text-[10px] uppercase tracking-wide text-[#2D2424] hover:bg-[#701a1a] hover:text-white transition-colors rounded-full border border-[#E6DCCA]/50"
                    >
                       {val} <X size={12} />
                    </button>
                 ))
              )}
              <button 
                onClick={() => setActiveFilters({})}
                className="text-[10px] uppercase tracking-widest text-[#701a1a] border-b border-[#701a1a] hover:text-[#C5A059] hover:border-[#C5A059] transition-colors ml-2"
              >
                Clear All
              </button>
           </div>
        )}

        {/* MAIN CONTENT GRID */}
        <div className="flex gap-8 relative min-h-[60vh]">
           <FilterSidebar 
              isOpen={filtersOpen} 
              onClose={() => setFiltersOpen(false)} 
              filters={activeFilters}
              setFilters={setActiveFilters}
           />

           <div className="flex-1">
             {loading ? (
               <div className="flex flex-col items-center justify-center h-64 gap-4">
                 <Loader2 className="animate-spin text-[#C5A059]" size={32} />
                 <span className="text-[10px] uppercase tracking-widest text-[#C5A059]">Loading Collection...</span>
               </div>
             ) : (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
                 <AnimatePresence mode='popLayout'>
                   {filteredProducts.map((product) => (
                     <motion.div
                       layout
                       key={product.id}
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       transition={{ duration: 0.2 }}
                     >
                       <ProductCard 
                          item={product}
                          onAddToCart={() => handleAddToCart(product)}
                          isFavorite={isFavorite(product.id)}
                          onToggleFavorite={toggleFavorite}
                       />
                     </motion.div>
                   ))}
                 </AnimatePresence>
               </div>
             )}
             
             {!loading && filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-[#E6DCCA] rounded-sm bg-[#F4F1EA]/20">
                   <p className="font-display text-2xl text-[#6B6060] mb-2">No Treasures Found</p>
                   <button 
                      onClick={() => setActiveFilters({})}
                      className="mt-4 px-6 py-2 bg-[#2D2424] text-white text-xs uppercase tracking-widest hover:bg-[#C5A059] transition-colors rounded-sm"
                   >
                      Reset Collection
                   </button>
                </div>
             )}
           </div>
        </div>

      </div>
      
      {/* FOOTER REMOVED - Handled by Layout */}
    </div>
  );
}