import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar'; // NEW IMPORT
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { SlidersHorizontal, ArrowUpDown, Search, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/hooks/useFavorites';
import { AppSkeleton } from '@/components/skeletons/AppSkeleton';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  
  // URL Params for initial category (e.g. from Home Page)
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCat = searchParams.get('cat');

  // Filter State
  const [filters, setFilters] = useState({
    categories: initialCat ? [initialCat.charAt(0).toUpperCase() + initialCat.slice(1)] : [],
    minPrice: 0,
    maxPrice: 1000000,
    colors: []
  });

  const [sortBy, setSortBy] = useState('newest');

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category Match
      if (filters.categories.length > 0 && (!p.subCategory || !filters.categories.includes(p.subCategory))) return false;
      // Price Match
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      // Color Match (Simple string check in name or tags)
      if (filters.colors.length > 0) {
        const pColor = (p.color || p.name).toLowerCase();
        const hasColor = filters.colors.some(c => pColor.includes(c.toLowerCase()));
        if (!hasColor) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'lowToHigh') return a.price - b.price;
      if (sortBy === 'highToLow') return b.price - a.price;
      return 0; // Default is Newest (from DB fetch)
    });
  }, [products, filters, sortBy]);

  if (loading) return <AppSkeleton />;

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-[#F5F0EB] py-12 px-4 text-center mb-8">
         <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-2">The Collection</h1>
         <p className="text-gray-500 text-sm max-w-md mx-auto">Discover the timeless elegance of handwoven Banarasi silk.</p>
      </div>

      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 pb-20 flex gap-10">
        
        {/* Sidebar (Desktop) */}
        <FilterSidebar 
          filters={filters} 
          setFilters={setFilters} 
          isOpen={mobileFilterOpen} 
          onClose={() => setMobileFilterOpen(false)} 
        />

        {/* Product Grid Area */}
        <div className="flex-1">
           
           {/* Toolbar */}
           <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 sticky top-20 z-30 bg-white/95 backdrop-blur-sm p-4 border border-gray-100 shadow-sm rounded-sm">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                 <span className="font-bold text-gray-900">{filteredProducts.length}</span> Products Found
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                 {/* Mobile Filter Trigger */}
                 <button 
                   onClick={() => setMobileFilterOpen(true)}
                   className="md:hidden flex-1 flex items-center justify-center gap-2 border border-gray-200 py-2.5 px-4 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors"
                 >
                    <SlidersHorizontal size={14} /> Filter
                 </button>

                 {/* Sort Dropdown */}
                 <div className="relative flex-1 md:w-48 group">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full appearance-none bg-transparent border border-gray-200 py-2.5 pl-4 pr-10 text-xs font-bold uppercase tracking-widest cursor-pointer outline-none hover:border-black transition-colors"
                    >
                       <option value="newest">Newest First</option>
                       <option value="lowToHigh">Price: Low to High</option>
                       <option value="highToLow">Price: High to Low</option>
                    </select>
                    <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                 </div>
              </div>
           </div>

           {/* Active Filters Chips */}
           {(filters.categories.length > 0 || filters.minPrice > 0 || filters.colors.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                 {filters.categories.map(c => (
                    <span key={c} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                       {c} <button onClick={() => setFilters(prev => ({...prev, categories: prev.categories.filter(x => x!==c)}))}><X size={12}/></button>
                    </span>
                 ))}
                 {filters.colors.map(c => (
                    <span key={c} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                       {c} <button onClick={() => setFilters(prev => ({...prev, colors: prev.colors.filter(x => x!==c)}))}><X size={12}/></button>
                    </span>
                 ))}
                 {(filters.categories.length > 0 || filters.colors.length > 0) && (
                    <button onClick={() => setFilters({categories: [], minPrice: 0, maxPrice: 1000000, colors: []})} className="text-xs text-red-500 underline self-center ml-2">Clear All</button>
                 )}
              </div>
           )}

           {/* Grid */}
           {filteredProducts.length === 0 ? (
             <div className="py-20 text-center bg-gray-50 rounded-sm">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-serif text-xl text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or price range.</p>
                <button 
                  onClick={() => setFilters({categories: [], minPrice: 0, maxPrice: 1000000, colors: []})}
                  className="text-[#B08D55] font-bold uppercase text-xs hover:underline"
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