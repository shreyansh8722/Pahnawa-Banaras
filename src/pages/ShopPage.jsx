import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { useProducts } from '@/context/ProductContext'; // Assuming you have this
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/context/CartContext';
import { CartModal } from '@/components/shop/CartModal';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- LUXURY ASSETS CONFIG ---
// This makes every category feel like a unique destination
const CATEGORY_HEADERS = {
  sarees: {
    title: "The Saree Edit",
    description: "Six yards of pure grace. Handwoven Banarasi silk masterpieces.",
    image: "https://images.unsplash.com/photo-1610189012906-47833d772097?auto=format&fit=crop&q=80"
  },
  lehengas: {
    title: "Bridal Heirlooms",
    description: "Intricate Jangla and Tanchoi weaves for your special day.",
    image: "https://images.unsplash.com/photo-1583391726247-e29237d8612f?auto=format&fit=crop&q=80"
  },
  suits: {
    title: "Unstitched Classics",
    description: "Versatile silk fabrics for the contemporary wardrobe.",
    image: "https://images.unsplash.com/photo-1621623194266-4b3664963684?auto=format&fit=crop&q=80"
  },
  men: {
    title: "The Royal Groom",
    description: "Sherwanis and Kurtas crafted for nobility.",
    image: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80"
  },
  default: {
    title: "All Collections",
    description: "Explore our complete range of handloom treasures.",
    image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80"
  }
};

export default function ShopPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('cat');
  const activeCategory = categoryParam ? categoryParam.toLowerCase() : 'default';
  
  // Data & State
  const headerData = CATEGORY_HEADERS[activeCategory] || CATEGORY_HEADERS['default'];
  const { products, loading } = useProducts(); // Replace with your actual hook
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Simple Filtering Logic (Expand this based on your backend/context)
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = [...products];
    if (categoryParam) {
      result = result.filter(p => p.category?.toLowerCase() === categoryParam.toLowerCase() || p.subCategory?.toLowerCase() === categoryParam.toLowerCase());
    }
    // Add sorting logic here if needed
    return result;
  }, [products, categoryParam, sortBy]);

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: 1 });
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-heritage-paper font-serif text-heritage-charcoal">
      <Navbar />
      
      {/* --- 1. EDITORIAL HEADER --- */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <motion.img 
          key={activeCategory} // Triggers animation on change
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          src={headerData.image} 
          alt={headerData.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center text-white p-4">
          <motion.div
            key={headerData.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl italic font-light mb-4 drop-shadow-lg">{headerData.title}</h1>
            <p className="font-sans text-sm md:text-base tracking-wide uppercase opacity-90 max-w-lg mx-auto leading-relaxed border-t border-white/30 pt-4 mt-2">
              {headerData.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* --- 2. MAIN LAYOUT --- */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row gap-12 relative">
        
        {/* Sticky Sidebar (Desktop) */}
        <aside className="hidden md:block w-64 shrink-0 sticky top-48 h-fit z-30">
           <FilterSidebar />
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-heritage-border">
             <span className="text-[10px] uppercase tracking-lux text-heritage-grey">
               Showing {filteredProducts.length} Heirlooms
             </span>
             
             <div className="flex gap-4">
               {/* Mobile Filter Trigger */}
               <button 
                 onClick={() => setMobileFiltersOpen(true)}
                 className="md:hidden flex items-center gap-2 text-[10px] uppercase tracking-widest text-heritage-charcoal"
               >
                 <SlidersHorizontal size={14} /> Filters
               </button>

               {/* Sort Dropdown (Custom UI) */}
               <div className="relative group">
                 <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest hover:text-heritage-gold transition-colors">
                   Sort By: <span className="font-bold">{sortBy}</span> <ChevronDown size={14} />
                 </button>
                 <div className="absolute right-0 top-full pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-40">
                   <div className="bg-heritage-paper shadow-xl border border-heritage-border py-2 w-40 flex flex-col">
                     {['Newest', 'Price: Low-High', 'Price: High-Low', 'Best Selling'].map(opt => (
                       <button 
                         key={opt}
                         onClick={() => setSortBy(opt)}
                         className="text-left px-4 py-2 text-xs hover:bg-heritage-sand transition-colors font-sans"
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
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12">
               {[...Array(6)].map((_, i) => <div key={i} className="aspect-[2/3] bg-heritage-sand animate-pulse" />)}
             </div>
          ) : filteredProducts.length > 0 ? (
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
               {filteredProducts.map(product => (
                 <ProductCard 
                   key={product.id} 
                   item={product} 
                   onAddToCart={() => handleAddToCart(product)}
                   isFavorite={favorites.includes(product.id)}
                   onToggleFavorite={toggleFavorite}
                 />
               ))}
             </div>
          ) : (
             <div className="py-20 text-center">
               <h3 className="text-2xl italic text-heritage-grey mb-4">No treasures found.</h3>
               <button onClick={() => navigate('/shop')} className="text-xs uppercase underline tracking-widest">Clear Filters</button>
             </div>
          )}

        </div>
      </div>

      <Footer />
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
      
      {/* Mobile Filter Sheet (Placeholder for functionality) */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            className="fixed inset-0 z-[100] bg-heritage-paper p-6 md:hidden overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl italic">Refine Selection</h2>
              <button onClick={() => setMobileFiltersOpen(false)}>Close</button>
            </div>
            <FilterSidebar mobile />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}