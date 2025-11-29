import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { SlidersHorizontal, ArrowUpDown, Search, X, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/hooks/useFavorites';
import { AppSkeleton } from '@/components/skeletons/AppSkeleton';
import { SEO } from '@/components/SEO';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  
  // URL Params for initial category
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCat = searchParams.get('cat');
  const initialType = searchParams.get('type');

  // Filter State
  const [filters, setFilters] = useState({
    categories: initialCat ? [initialCat.charAt(0).toUpperCase() + initialCat.slice(1)] : [],
    minPrice: 0,
    maxPrice: 1000000,
    colors: []
  });

  const [sortBy, setSortBy] = useState('newest');

  // Fetch Products (Fetch ALL once, then client-side filter for speed)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Optimized: Fetch only necessary fields if possible, but for now fetch all
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Update filters if URL params change (e.g. clicking Nav links)
  useEffect(() => {
    if (initialCat) {
        const catName = initialCat.charAt(0).toUpperCase() + initialCat.slice(1);
        setFilters(prev => ({ ...prev, categories: [catName] }));
    }
  }, [initialCat]);

  // Client-Side Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category Match
      if (filters.categories.length > 0) {
        // Match either category OR subCategory
        const catMatch = filters.categories.some(c => 
            (p.category && p.category.includes(c)) || 
            (p.subCategory && p.subCategory.includes(c))
        );
        if (!catMatch) return false;
      }

      // Price Match
      const price = Number(p.price) || 0;
      if (price < filters.minPrice || price > filters.maxPrice) return false;

      // Color Match
      if (filters.colors.length > 0) {
        const pColor = (p.color || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        const hasColor = filters.colors.some(c => pColor.includes(c.toLowerCase()) || pName.includes(c.toLowerCase()));
        if (!hasColor) return false;
      }
      
      // Type Param (Optional sub-filter from URL)
      if (initialType) {
         const typeMatch = JSON.stringify(p).toLowerCase().includes(initialType.toLowerCase());
         if (!typeMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'lowToHigh') return Number(a.price) - Number(b.price);
      if (sortBy === 'highToLow') return Number(b.price) - Number(a.price);
      return 0; // Default Newest
    });
  }, [products, filters, sortBy, initialType]);

  if (loading) return <AppSkeleton />;

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col">
      <SEO 
        title="Shop Collections | Pahnawa Banaras" 
        description="Browse our exclusive collection of handwoven Banarasi sarees, lehengas, and suits." 
      />
      <Navbar />

      {/* Header Banner */}
      <div className="bg-[#F5F0EB] py-12 px-4 text-center border-b border-[#E5DCCF]">
         <h1 className="font-serif text-3xl md:text-5xl text-gray-900 mb-3">
            {initialCat ? `${initialCat.charAt(0).toUpperCase() + initialCat.slice(1)} Collection` : 'All Collections'}
         </h1>
         <p className="text-gray-500 text-xs md:text-sm max-w-lg mx-auto uppercase tracking-widest leading-relaxed">
            Discover the timeless elegance of authentic handwoven silk directly from the weavers of Varanasi.
         </p>
      </div>

      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 pb-20 flex gap-8 lg:gap-12 mt-8">
        
        {/* Sidebar (Desktop) */}
        <FilterSidebar 
          filters={filters} 
          setFilters={setFilters} 
          isOpen={mobileFilterOpen} 
          onClose={() => setMobileFilterOpen(false)} 
        />

        {/* Product Grid Area */}
        <div className="flex-1 min-h-[500px]">
           
           {/* Toolbar */}
           <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 sticky top-20 z-30 bg-white/95 backdrop-blur-md p-3 border border-gray-100 shadow-sm rounded-sm">
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                 Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> Masterpieces
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                 {/* Mobile Filter Trigger */}
                 <button 
                   onClick={() => setMobileFilterOpen(true)}
                   className="md:hidden flex-1 flex items-center justify-center gap-2 border border-gray-200 py-2.5 px-4 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors bg-white"
                 >
                    <SlidersHorizontal size={14} /> Filter
                 </button>

                 {/* Sort Dropdown */}
                 <div className="relative flex-1 md:w-48 group">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-200 py-2.5 pl-4 pr-10 text-xs font-bold uppercase tracking-widest cursor-pointer outline-none hover:border-black transition-colors"
                    >
                       <option value="newest">Newest First</option>
                       <option value="lowToHigh">Price: Low to High</option>
                       <option value="highToLow">Price: High to Low</option>
                    </select>
                    <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                 </div>
              </div>
           </div>

           {/* Active Filters Chips */}
           {(filters.categories.length > 0 || filters.minPrice > 0 || filters.colors.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                 {filters.categories.map(c => (
                    <span key={c} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-sm text-xs font-bold flex items-center gap-2">
                       {c} <button onClick={() => setFilters(prev => ({...prev, categories: prev.categories.filter(x => x!==c)}))}><X size={12} className="hover:text-red-500"/></button>
                    </span>
                 ))}
                 {filters.colors.map(c => (
                    <span key={c} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-sm text-xs font-bold flex items-center gap-2">
                       {c} <button onClick={() => setFilters(prev => ({...prev, colors: prev.colors.filter(x => x!==c)}))}><X size={12} className="hover:text-red-500"/></button>
                    </span>
                 ))}
                 {(filters.categories.length > 0 || filters.colors.length > 0 || filters.minPrice > 0) && (
                    <button onClick={() => setFilters({categories: [], minPrice: 0, maxPrice: 1000000, colors: []})} className="text-xs text-red-500 underline self-center ml-2">Clear All</button>
                 )}
              </div>
           )}

           {/* Grid */}
           {filteredProducts.length === 0 ? (
             <div className="py-24 text-center bg-gray-50 rounded-sm border border-dashed border-gray-200">
                <Search size={40} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-serif text-xl text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-500 mb-6 text-sm">We couldn't find any matches for your selected filters.</p>
                <button 
                  onClick={() => setFilters({categories: [], minPrice: 0, maxPrice: 1000000, colors: []})}
                  className="text-white bg-[#B08D55] px-6 py-3 rounded-sm font-bold uppercase text-xs hover:bg-black transition-colors"
                >
                  Clear All Filters
                </button>
             </div>
           ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 gap-y-8 md:gap-6 md:gap-y-12">
               {filteredProducts.map(item => (
                 <ProductCard 
                   key={item.id} 
                   item={item} 
                   onAddToCart={() => addToCart({...item, quantity: 1})}
                   isFavorite={favorites.includes(item.id)}
                   onToggleFavorite={toggleFavorite}
                 />
               ))}
             </div>
           )}
        </div>
      </div>
      <Footer />
    </div>
  );
}