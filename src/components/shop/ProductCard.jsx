import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { LazyImage } from '@/components/LazyImage';
import { useCart } from '@/context/CartContext';

export const ProductCard = ({ item, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  // Fallback for missing favorite/toggle props
  const safeToggle = onToggleFavorite || (() => {});
  const safeIsFavorite = isFavorite || false;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ ...item, quantity: 1 });
  };

  return (
    <div 
      className="group cursor-pointer flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${item.id}`)}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-brand-sand/20">
        
        {/* Primary Image */}
        <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
           <LazyImage src={item.featuredImageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>
        
        {/* Secondary (Hover) Image - with subtle zoom */}
        <div className={`absolute inset-0 transition-all duration-1000 ease-out ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}>
           <LazyImage src={item.imageUrls?.[1] || item.featuredImageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>

        {/* Floating Actions (Appear on Hover) */}
        <div className={`absolute bottom-4 right-4 flex flex-col gap-3 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
           
           {/* Wishlist */}
           <button 
             onClick={(e) => { e.stopPropagation(); safeToggle(item.id); }}
             className="bg-white p-3 rounded-full shadow-lg text-brand-charcoal hover:bg-brand-primary hover:text-white transition-colors duration-300"
           >
             <Heart size={16} strokeWidth={1.5} fill={safeIsFavorite ? "currentColor" : "none"} />
           </button>
           
           {/* Add to Cart */}
           <button 
             onClick={handleAddToCart}
             className="bg-white p-3 rounded-full shadow-lg text-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-colors duration-300"
           >
             <ShoppingBag size={16} strokeWidth={1.5} />
           </button>
        </div>
      </div>

      {/* METADATA */}
      <div className="mt-5 text-left space-y-1">
        <h3 className="font-serif text-lg text-brand-charcoal italic tracking-wide group-hover:text-brand-primary transition-colors duration-300">
          {item.name}
        </h3>
        
        <div className="flex justify-between items-center pt-1">
           <span className="text-[10px] text-brand-charcoal/60 uppercase tracking-lux">
             {item.subCategory}
           </span>
           <span className="font-sans text-sm text-brand-charcoal font-medium">
             ₹{formatPrice(item.price)}
           </span>
        </div>
      </div>
    </div>
  );
};