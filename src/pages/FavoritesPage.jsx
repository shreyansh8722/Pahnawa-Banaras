import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { SEO } from '@/components/SEO';

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const moveToCart = (item) => {
    addToCart({ ...item, quantity: 1 });
    removeFromFavorites(item.id);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2424] font-sans selection:bg-[#C5A059] selection:text-white">
      <SEO title="My Wishlist - Pahnawa Banaras" />

      {/* NAVBAR REMOVED - Handled by Layout */}

      <div className="pt-8 pb-20 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto animate-fade-in">
        
        {/* HEADER */}
        <div className="text-center mb-12 border-b border-[#E6DCCA]/60 pb-8">
           <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-2 block">
              Your Curated Collection
           </span>
           <h1 className="font-display text-3xl md:text-5xl text-[#2D2424]">
              My Wishlist
           </h1>
           <p className="text-[#6B6060] font-serif italic mt-2">
              {favorites.length} {favorites.length === 1 ? 'treasure' : 'treasures'} saved
           </p>
        </div>

        {/* EMPTY STATE */}
        {favorites.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#E6DCCA] rounded-sm bg-[#F4F1EA]/30">
              <div className="w-20 h-20 bg-[#F4F1EA] rounded-full flex items-center justify-center mb-6 text-[#C5A059]">
                 <Heart size={32} strokeWidth={1} />
              </div>
              <h3 className="font-display text-2xl text-[#2D2424] mb-2">Your Wishlist is Empty</h3>
              <p className="text-[#6B6060] max-w-md mb-8 font-light">
                 "The joy of dressing is an art." Save your favorite masterpieces here to view them later.
              </p>
              <Link 
                 to="/shop" 
                 className="px-8 py-3 bg-[#2D2424] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#701a1a] transition-all shadow-lg flex items-center gap-2 group"
              >
                 Explore Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
        ) : (
           /* GRID LAYOUT */
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              <AnimatePresence mode='popLayout'>
                 {favorites.map((product) => (
                    <motion.div 
                       layout
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.9 }}
                       key={product.id} 
                       className="group bg-white border border-[#E6DCCA] rounded-sm overflow-hidden hover:shadow-xl hover:border-[#C5A059]/30 transition-all duration-500"
                    >
                       {/* Image */}
                       <div className="relative aspect-[3/4] overflow-hidden bg-[#F4F1EA]">
                          <Link to={`/product/${product.id}`}>
                             <img 
                                src={product.featuredImageUrl || product.imageUrls?.[0]} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                             />
                          </Link>
                          
                          {/* Remove Button (Top Right) */}
                          <button 
                             onClick={() => removeFromFavorites(product.id)}
                             className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-[#6B6060] hover:text-red-700 hover:bg-white transition-colors shadow-sm z-10"
                             title="Remove from Wishlist"
                          >
                             <Trash2 size={16} />
                          </button>

                          {/* Quick Add Overlay */}
                          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                             <button 
                                onClick={() => moveToCart(product)}
                                className="w-full bg-white text-[#2D2424] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-colors shadow-lg flex items-center justify-center gap-2"
                             >
                                <ShoppingBag size={14} /> Move to Bag
                             </button>
                          </div>
                       </div>

                       {/* Content */}
                       <div className="p-5 text-center">
                          <p className="text-[10px] uppercase tracking-widest text-[#6B6060] mb-1">
                             {product.category}
                          </p>
                          <Link to={`/product/${product.id}`}>
                             <h3 className="font-serif text-lg text-[#2D2424] mb-2 truncate hover:text-[#701a1a] transition-colors">
                                {product.name}
                             </h3>
                          </Link>
                          <p className="font-bold text-[#701a1a]">
                             ₹{formatPrice(product.price)}
                          </p>
                       </div>
                    </motion.div>
                 ))}
              </AnimatePresence>
           </div>
        )}
      </div>
      
      {/* FOOTER REMOVED - Handled by Layout */}
    </div>
  );
}