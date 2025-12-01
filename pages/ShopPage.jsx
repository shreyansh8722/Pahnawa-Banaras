import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { useProducts } from '@/context/ProductContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/context/CartContext';
import { CartModal } from '@/components/shop/CartModal';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteAssets } from '@/hooks/useSiteAssets';

// --- HEADER CONFIGURATION ---
const HEADER_CONFIG = {
  sarees: {
    title: "The Saree Edit",
    description: "Six yards of pure grace. Handwoven Banarasi silk masterpieces.",
    imgKey: 'header_sarees'
  },
  lehengas: {
    title: "Bridal Heirlooms",
    description: "Intricate Jangla and Tanchoi weaves for your special day.",
    imgKey: 'header_lehengas'
  },
  suits: {
    title: "Unstitched Classics",
    description: "Versatile silk fabrics for the contemporary wardrobe.",
    imgKey: 'header_suits'
  },
  men: {
    title: "The Royal Groom",
    description: "Sherwanis and Kurtas crafted for nobility.",
    imgKey: 'header_men'
  },
  default: {
    title: "All Collections",
    description: "Explore our complete range of handloom treasures.",
    imgKey: 'header_default'
  }
};

export default function ShopPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('cat');
  const activeCategory = categoryParam ? categoryParam.toLowerCase() : 'default';
  
  // Hooks
  const { getAsset } = useSiteAssets();
  const { products, loading } = useProducts();
  
  // FIX: Destructure isFavorite helper
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  const { addToCart } = useCart();
  
  // State
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Derive Header Data
  const config = HEADER_CONFIG[activeCategory] || HEADER_CONFIG['default'];
  const headerImage = getAsset(config.imgKey); 

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = [...products];
    if (categoryParam) {
      result = result.filter(p => p.category?.toLowerCase() === categoryParam.toLowerCase() || p.subCategory?.toLowerCase() === categoryParam.toLowerCase());
    }
    
    // Sort Logic
    if (sortBy === 'Price: Low-High') result.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortBy === 'Price: High-Low') result.sort((a, b) => Number(b.price) - Number(a.price));

    return result;
  }, [products, categoryParam, sortBy]);

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: 1 });
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-white font-serif text-heritage-charcoal selection:bg-heritage-gold selection:text-white">
      <Navbar />
      
      {/* --- 1. DYNAMIC EDITORIAL HEADER --- */}
      <div className="relative h-[45vh] md:h-[55vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <motion.img 
          key={activeCategory} 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          src={headerImage} 
          alt={config.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center text-white px-6">
          <motion.div
            key={config.title}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="block text-sm font-bold font-sans uppercase tracking-[0.3em] mb-6 text-white/90">
              Handwoven Purity
            </span>
            <h1 className="text-6xl md:text-8xl italic font-light mb-6 leading-none">{config.title}</h1>
            <p className="font-sans text-base md:text-lg tracking-wide opacity-90 max-w-lg mx-auto font-light leading-relaxed">
              {config.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* --- 2. MAIN LAYOUT --- */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row gap-16 relative">
        
        {/* Sticky Sidebar (Desktop) */}
        <aside className="hidden md:block w-72 shrink-0 sticky top-48 h-fit z-30">
           <FilterSidebar />
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-12 pb-6 border-b border-gray-100">
             <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
               {filteredProducts.length} Products Found
             </span>
             
             <div className="flex gap-8">
               {/* Mobile Filter Trigger */}
               <button 
                 onClick={() => setMobileFiltersOpen(true)}
                 className="md:hidden flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-heritage-charcoal"
               >
                 <SlidersHorizontal size={16} /> Filters
               </button>

               {/* Sort Dropdown */}
               <div className="relative group">
                 <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-heritage-gold transition-colors">
                   Sort: <span className="text-heritage-charcoal">{sortBy}</span> <ChevronDown size={14} />
                 </button>
                 <div className="absolute right-0 top-full pt-4 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-40">
                   <div className="bg-white shadow-2xl border border-gray-100 py-3 w-48 flex flex-col">
                     {['Newest', 'Price: Low-High', 'Price: High-Low', 'Best Selling'].map(opt => (
                       <button 
                         key={opt}
                         onClick={() => setSortBy(opt)}
                         className="text-left px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors text-gray-600 hover:text-black font-sans"
                       >
                         {opt}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
          </div>

          {/* Product Grid */}
          {loading ? (
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
               {[...Array(6)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse" />)}
             </div>
          ) : filteredProducts.length > 0 ? (
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
               {filteredProducts.map(product => (
                 <ProductCard 
                   key={product.id} 
                   item={product} 
                   onAddToCart={() => handleAddToCart(product)}
                   
                   // FIX: Use helper function
                   isFavorite={isFavorite(product.id)}
                   
                   onToggleFavorite={toggleFavorite}
                 />
               ))}
             </div>
          ) : (
             <div className="py-32 text-center">
               <h3 className="font-serif text-3xl italic text-gray-400 mb-6">No treasures found matching your criteria.</h3>
               <button onClick={() => navigate('/shop')} className="text-xs uppercase font-bold tracking-widest border-b border-black pb-1 hover:text-heritage-gold hover:border-heritage-gold transition-colors">
                 Clear All Filters
               </button>
             </div>
          )}

        </div>
      </div>

      <Footer />
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
      
      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: "tween", ease: "circOut", duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-white p-8 md:hidden overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
              <h2 className="font-serif text-3xl italic">Refine Selection</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-xs font-bold uppercase tracking-widest">Close</button>
            </div>
            <FilterSidebar mobile />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}