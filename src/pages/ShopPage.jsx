import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { FilterModal } from '@/components/home/FilterModal'; 
import { Filter, SlidersHorizontal, ChevronDown, ArrowDownUp, Check } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/context/CartContext';
import { SEO } from '@/components/SEO';
import { motion, AnimatePresence } from 'framer-motion';

const FILTER_OPTIONS = [
  { id: 'All', name: 'All Collections' },
  { id: 'Saree', name: 'Banarasi Sarees' },
  { id: 'Lehenga', name: 'Bridal Lehengas' },
  { id: 'Suit', name: 'Suits' },
  { id: 'Dupatta', name: 'Dupattas' },
  { id: 'Fabric', name: 'Fabrics' },
];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest Arrivals' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('cat') || 'All';
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [isSortOpen, setIsSortOpen] = useState(false); // NEW State
  
  const sortRef = useRef(null);
  
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();

  // Close sort menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsRef = collection(db, 'products');
        let q;

        if (categoryParam === 'All' || !categoryParam) {
          q = query(productsRef, orderBy('createdAt', 'desc'));
        } else {
          let dbCategory = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
          if (dbCategory.endsWith('s')) dbCategory = dbCategory.slice(0, -1); 
          q = query(productsRef, where('subCategory', '==', dbCategory));
        }

        const snap = await getDocs(q);
        const fetchedProducts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryParam]);

  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'newest':
      default:
        return sorted.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }
  }, [products, sortBy]);

  const handleFilterSelect = (id) => {
    if (id === 'All') setSearchParams({});
    else setSearchParams({ cat: id.toLowerCase() });
  };

  const pageTitle = categoryParam === 'All' ? 'All Collections' : categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col">
      <SEO title={`${pageTitle} - Pahnawa Banaras`} />
      <Navbar />

      {/* Header */}
      <div className="bg-[#F5F0EB] py-12 md:py-20 text-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl text-brand-dark mb-4">{pageTitle}</h1>
            <p className="text-gray-500 text-xs md:text-sm uppercase tracking-[0.2em]">Handwoven Elegance</p>
          </motion.div>
      </div>

      {/* Control Bar */}
      <div className="sticky top-[60px] md:top-[80px] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3 px-4 md:px-8 flex justify-between items-center shadow-sm">
        
        {/* Filter Button */}
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600 border border-gray-200 px-4 py-2 rounded-sm hover:border-[#B08D55] hover:text-[#B08D55] transition-all"
        >
          <SlidersHorizontal size={14} /> Filter
        </button>

        {/* Custom Sort Dropdown */}
        <div className="relative" ref={sortRef}>
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-800 hover:text-[#B08D55] transition-colors"
            >
               <ArrowDownUp size={14} className="text-gray-400" />
               <span className="hidden sm:inline">Sort By:</span>
               <span>{SORT_OPTIONS.find(o => o.id === sortBy)?.label}</span>
               <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-40"
                >
                  {SORT_OPTIONS.map(option => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex justify-between items-center hover:bg-gray-50 transition-colors ${
                        sortBy === option.id ? 'text-[#B08D55] bg-[#B08D55]/5' : 'text-gray-600'
                      }`}
                    >
                      {option.label}
                      {sortBy === option.id && <Check size={14} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex-grow w-full min-h-[50vh]">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {[...Array(8)].map((_, i) => (
               <div key={i} className="w-full aspect-[2/3] bg-gray-100 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <Filter size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-serif text-xl mb-4">No products found.</p>
            <button onClick={() => handleFilterSelect('All')} className="text-[#B08D55] underline uppercase tracking-widest text-xs">View All Collections</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-10 md:gap-x-8 md:gap-y-12">
            {sortedProducts.map(item => (
              <ProductCard 
                key={item.id} 
                item={item} 
                onAddToCart={() => addToCart(item)}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      <FilterModal 
        open={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        currentFilter={categoryParam === 'All' ? 'All' : categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}
        onFilterSelect={handleFilterSelect}
        filterOptions={FILTER_OPTIONS}
      />

      <Footer />
    </div>
  );
}