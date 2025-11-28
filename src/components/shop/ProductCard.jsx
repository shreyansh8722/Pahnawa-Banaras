import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils'; // Assuming you have this, if not use .toLocaleString()

export const ProductCard = ({ item, onAddToCart, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Logic to determine secondary image for hover effect
  const primaryImage = item.featuredImageUrl;
  const secondaryImage = item.imageUrls?.[1] || item.featuredImageUrl;
  
  const isOutOfStock = item.stock <= 0;
  const isLowStock = item.stock > 0 && item.stock < 5;

  return (
    <div 
      className="group relative flex flex-col w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* IMAGE CONTAINER */}
      <div 
        onClick={() => navigate(`/product/${item.id}`)}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-gray-100 cursor-pointer"
      >
        {/* Primary Image */}
        <img 
          src={primaryImage} 
          alt={item.name} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
        />
        
        {/* Secondary Image (Reveals on Hover) */}
        <img 
          src={secondaryImage} 
          alt={item.name} 
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out transform ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          loading="lazy"
        />

        {/* BADGES */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {isOutOfStock ? (
             <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">Sold Out</span>
          ) : isLowStock ? (
             <span className="bg-[#B08D55] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">Only {item.stock} Left</span>
          ) : null}
        </div>

        {/* ACTION OVERLAY (Desktop) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block z-20">
           <button 
             onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
             disabled={isOutOfStock}
             className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
           >
             <ShoppingBag size={14} /> {isOutOfStock ? 'Sold Out' : 'Quick Add'}
           </button>
        </div>

        {/* WISHLIST BUTTON (Always Visible) */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-all shadow-sm z-20"
        >
          <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"} />
        </button>
      </div>

      {/* DETAILS */}
      <div className="mt-3 space-y-1">
        <h3 
          onClick={() => navigate(`/product/${item.id}`)}
          className="text-sm font-medium text-gray-900 line-clamp-1 cursor-pointer hover:text-[#B08D55] transition-colors"
        >
          {item.name}
        </h3>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{item.subCategory}</p>
        <div className="flex items-baseline gap-2">
           <span className="text-sm font-bold text-gray-900">₹{formatPrice(item.price)}</span>
           {item.comparePrice > item.price && (
             <span className="text-xs text-gray-400 line-through">₹{formatPrice(item.comparePrice)}</span>
           )}
        </div>
      </div>
      
      {/* MOBILE ADD BUTTON (Visible only on mobile) */}
      <button 
         onClick={() => onAddToCart(item)}
         disabled={isOutOfStock}
         className="md:hidden mt-3 w-full border border-gray-200 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-900 hover:border-[#B08D55] hover:text-[#B08D55] transition-colors disabled:opacity-50"
      >
        {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
      </button>
    </div>
  );
};