import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { SlidersHorizontal, ArrowUpDown, Search, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
  // --- URL PARAMETERS ---
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeCat = searchParams.get('cat');
  const activeType = searchParams.get('type');
  const activeSearch = searchParams.get('search'); // This handles the new Search Logic

  // --- FILTER STATE ---
  const [filters, setFilters] = useState({
    categories: activeCat ? [activeCat.charAt(0).toUpperCase() + activeCat.slice(1)] : [],
    minPrice: 0,
    maxPrice: 1000000,
    colors: []
  });

  const [sortBy, setSortBy] = useState('newest');

  // --- 1. FETCH PRODUCTS ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
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

  // --- 2. SYNC FILTERS WITH URL ---
  useEffect(() => {
    // If URL has a category, set it. If not, don't clear it immediately to allow manual filtering.
    if (activeCat) {
        const catName = activeCat.charAt(0).toUpperCase() + activeCat.slice(1);
        setFilters(prev => ({ ...prev, categories: [catName] }));
    }
  }, [activeCat]);

  // --- 3. FILTERING LOGIC (Includes Search) ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // A. Search Query Match (Highest Priority)
      if (activeSearch) {
        const q = activeSearch.toLowerCase();
        const matchesSearch = 
          p.name?.toLowerCase().includes(q) || 
          p.category?.toLowerCase().includes(q) ||
          p.subCategory?.toLowerCase().includes(q) ||
          p.keywords?.some(k => k.toLowerCase().includes(q));
        
        if (!matchesSearch) return false;
      }

      // B. Category Match
      if (filters.categories.length > 0) {
        const catMatch = filters.categories.some(c => 
            (p.category && p.category.includes(c)) || 
            (p.subCategory && p.subCategory.includes(c))
        );
        if (!catMatch) return false;
      }

      // C. Price Match
      const price = Number(p.price) || 0;
      if (price < filters.minPrice || price > filters.maxPrice) return false;

      // D. Color Match
      if (filters.colors.length > 0) {
        const pColor = (p.color || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        const hasColor = filters.colors.some(c => pColor.includes(c.toLowerCase()) || pName.includes(c.toLowerCase()));
        if (!hasColor) return false;
      }
      
      // E. Type Param (Optional specific sub-filter from URL)
      if (activeType) {
         const typeMatch = JSON.stringify(p).toLowerCase().includes(activeType.toLowerCase());
         if (!typeMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'lowToHigh') return Number(a.price) - Number(b.price);
      if (sortBy === 'highToLow') return Number(b.price) - Number(a.price);
      return 0; // Default Newest
    });
  }, [products, filters, sortBy, activeType, activeSearch]);

  // Helper to clear specific filters
  const clearFilters = () => {
    setFilters({categories: [], minPrice: 0, maxPrice: 1000000, colors: []});
    if (activeSearch || activeCat) navigate('/shop'); // Reset URL
  };

  if (loading) return <AppSkeleton />;

  return (
    <div className="min-h-screen bg-heritage-paper font-serif text-heritage-charcoal flex flex-col">
      <SEO 
        title={activeSearch ? `Search Results for "${activeSearch}"` : "The Collection | Pahnawa Banaras"} 
        description="Browse our exclusive collection of handwoven Banarasi sarees, lehengas, and suits." 
      />
      <Navbar />

      {/* --- HEADER BANNER --- */}
      <div className="bg-heritage-sand py-16 px-4 text-center border-b border-heritage-border mt-20 md:mt-24">
         <span className="text-[10px] text-heritage-gold uppercase tracking-lux mb-2 block">
            {activeSearch ? 'Search Results' : 'Handwoven in Varanasi'}
         </span>
         <h1 className="text-4xl md:text-5xl font-light italic text-heritage-charcoal mb-4">
            {activeSearch ? `"${activeSearch}"` : (activeCat ? `${activeCat.charAt(0).toUpperCase() + activeCat.slice(1)}` : 'The Collection')}
         </h1>
         {!activeSearch && (
           <p className="text-heritage-grey text-xs md:text-sm max-w-lg mx-auto font-sans leading-relaxed">
              Timeless heirlooms woven with patience, passion, and purity.
           </p>
         )}
      </div>

      <div className="max-w-[1800px] mx-auto w-full px-4 md:px-8 pb-20 flex gap-8 lg:gap-12 mt-12">
        
        {/* --- SIDEBAR (Desktop) --- */}
        <FilterSidebar 
          filters={filters} 
          setFilters={setFilters} 
          isOpen={mobileFilterOpen} 
          onClose={() => setMobileFilterOpen(false)} 
        />

        {/* --- PRODUCT GRID --- */}
        <div className="flex-1 min-h-[500px]">
           
           {/* TOOLBAR */}
           <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 sticky top-24 z-30 bg-heritage-paper/95 backdrop-blur-md p-4 border border-heritage-border shadow-sm">
              <div className="flex items-center gap-2 text-xs text-heritage-grey font-sans uppercase tracking-widest">
                 Found <span className="font-bold text-heritage-charcoal">{filteredProducts.length}</span> Masterpieces
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                 {/* Mobile Filter Button */}
                 <button 
                   onClick={() => setMobileFilterOpen(true)}
                   className="md:hidden flex-1 flex items-center justify-center gap-2 border border-heritage-charcoal text-heritage-charcoal py-3 px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-heritage-charcoal hover:text-white transition-colors"
                 >
                    <SlidersHorizontal size={14} /> Filter
                 </button>

                 {/* Sort Dropdown */}
                 <div className="relative flex-1 md:w-56 group">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full appearance-none bg-transparent border border-heritage-border py-3 pl-4 pr-10 text-[10px] font-bold uppercase tracking-widest cursor-pointer outline-none hover:border-heritage-charcoal transition-colors text-heritage-charcoal"
                    >
                       <option value="newest">Newest Additions</option>
                       <option value="lowToHigh">Price: Low to High</option>
                       <option value="highToLow">Price: High to Low</option>
                    </select>
                    <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-heritage-grey" />
                 </div>
              </div>
           </div>

           {/* ACTIVE FILTER CHIPS */}
           {(filters.categories.length > 0 || filters.minPrice > 0 || filters.colors.length > 0 || activeSearch) && (
              <div className="flex flex-wrap gap-2 mb-8">
                 {activeSearch && (
                    <span className="bg-heritage-charcoal text-white px-4 py-1.5 text-[10px] uppercase tracking-widest flex items-center gap-2">
                       Search: {activeSearch} <button onClick={() => navigate('/shop')}><X size={12} /></button>
                    </span>
                 )}
                 {filters.categories.map(c => (
                    <span key={c} className="bg-heritage-sand text-heritage-charcoal px-3 py-1.5 text-[10px] uppercase tracking-widest flex items-center gap-2 border border-heritage-border">
                       {c} <button onClick={() => setFilters(prev => ({...prev, categories: prev.categories.filter(x => x!==c)}))}><X size={12} /></button>
                    </span>
                 ))}
                 {filters.colors.map(c => (
                    <span key={c} className="bg-heritage-sand text-heritage-charcoal px-3 py-1.5 text-[10px] uppercase tracking-widest flex items-center gap-2 border border-heritage-border">
                       {c} <button onClick={() => setFilters(prev => ({...prev, colors: prev.colors.filter(x => x!==c)}))}><X size={12} /></button>
                    </span>
                 ))}
                 <button onClick={clearFilters} className="text-[10px] uppercase tracking-widest text-red-700 underline underline-offset-4 self-center ml-2 hover:text-red-900">
                    Clear All
                 </button>
              </div>
           )}

           {/* GRID */}
           {filteredProducts.length === 0 ? (
             <div className="py-32 text-center bg-heritage-sand/30 border border-dashed border-heritage-border">
                <Search size={48} className="mx-auto text-heritage-border mb-6" strokeWidth={1} />
                <h3 className="font-serif text-2xl text-heritage-charcoal mb-2 italic">No Masterpieces Found</h3>
                <p className="text-heritage-grey mb-8 text-sm font-sans max-w-md mx-auto">
                   We couldn't find any items matching your selection. Try adjusting your filters or search terms.
                </p>
                <button 
                  onClick={clearFilters}
                  className="bg-heritage-charcoal text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-heritage-gold transition-colors"
                >
                  View Full Collection
                </button>
             </div>
           ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-10 md:gap-8 md:gap-y-16">
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