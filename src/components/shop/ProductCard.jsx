import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { LazyImage } from '@/components/LazyImage'; // Keeping your optimization

export const ProductCard = ({ item, onAddToCart, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative cursor-pointer flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${item.id}`)}
    >
      {/* IMAGE - TALL ASPECT RATIO (2/3) */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-heritage-sand">
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
           <LazyImage src={item.featuredImageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className={`absolute inset-0 transition-transform duration-[2s] ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}>
           <LazyImage src={item.imageUrls?.[1] || item.featuredImageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>

        {/* Wishlist Button - Minimal */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
          className="absolute top-3 right-3 z-20 text-heritage-charcoal hover:scale-110 transition-transform"
        >
          <Heart size={18} strokeWidth={1} fill={isFavorite ? "#1C1C1C" : "none"} />
        </button>

        {/* Quick Add - Slide Up on Hover */}
        <div className={`absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md py-4 text-center transition-transform duration-500 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
           <button 
             onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
             className="text-[10px] uppercase tracking-widest text-heritage-charcoal hover:text-heritage-gold"
           >
             Quick Add
           </button>
        </div>
      </div>

      {/* METADATA - Clean & Center */}
      <div className="mt-4 text-center space-y-1">
        <h3 className="font-serif text-lg text-heritage-charcoal italic tracking-wide">
          {item.name}
        </h3>
        <p className="text-[9px] text-heritage-grey uppercase tracking-lux">
          {item.subCategory}
        </p>
        <div className="text-sm font-sans text-heritage-charcoal pt-1">
           ₹{formatPrice(item.price)}
        </div>
      </div>
    </div>
  );
};