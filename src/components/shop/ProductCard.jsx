import React, { useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyImage } from '@/components/LazyImage';
import { Heart, ShoppingBag, Plus, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const ProductCardComponent = ({ item, onAddToCart, onToggleFavorite, isFavorite }) => {
  const navigate = useNavigate();

  const imageSrc = useMemo(() => 
    item.featuredImageUrl || item.imageUrls?.[0] || 'https://placehold.co/600x900', 
  [item.featuredImageUrl, item.imageUrls]);
  
  const hoverImageSrc = useMemo(() => 
    (item.imageUrls && item.imageUrls.length > 1) ? item.imageUrls[1] : imageSrc, 
  [item.imageUrls, imageSrc]);

  const discountPercentage = item.comparePrice > item.price
    ? Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)
    : 0;

  const handleCardClick = (e) => {
    e.preventDefault();
    navigate(`/product/${item.id}`);
  };

  return (
    <div className="group relative cursor-pointer flex flex-col gap-3 h-full" onClick={handleCardClick}>
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-gray-100 rounded-sm">
        <div className="absolute inset-0 transition-opacity duration-700 ease-in-out group-hover:opacity-0 z-10">
          <LazyImage src={imageSrc} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <img src={hoverImageSrc} alt={item.name} className="absolute inset-0 w-full h-full object-cover z-0" loading="lazy" />

        <button
          onClick={(e) => { e.stopPropagation(); if (onToggleFavorite) onToggleFavorite(item.id); }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-300 z-20 md:opacity-0 md:translate-y-[-10px] md:group-hover:opacity-100 md:group-hover:translate-y-0 shadow-sm"
        >
          <Heart size={18} fill={isFavorite ? "#ef4444" : "none"} className={isFavorite ? "text-red-500" : ""} />
        </button>

        {/* NEW: Rating Badge */}
        {item.averageRating > 0 && (
          <div className="absolute bottom-2 left-2 z-20 bg-white/90 px-2 py-1 rounded-sm flex items-center gap-1 shadow-sm text-[10px] font-bold md:opacity-0 md:translate-y-[10px] md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
             <span className="bg-green-700 text-white px-1 rounded flex items-center gap-0.5">
               {item.averageRating.toFixed(1)} <Star size={8} fill="white" />
             </span>
             <span className="text-gray-500">({item.reviewCount})</span>
          </div>
        )}

        {discountPercentage > 0 && (
          <span className="absolute top-2 left-2 z-20 bg-[#B08D55] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm shadow-sm">
            -{discountPercentage}%
          </span>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
          className="md:hidden absolute bottom-2 right-2 z-20 p-2.5 bg-white text-black rounded-full shadow-lg border border-gray-100 active:scale-90 transition-transform"
        >
          <Plus size={18} />
        </button>

        <div className="absolute inset-x-0 bottom-0 z-20 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hidden md:block">
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
            className="w-full bg-white text-brand-dark py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-colors shadow-lg flex items-center justify-center gap-2 rounded-sm border border-gray-100"
          >
            <ShoppingBag size={14} /> Quick Add
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-1 flex-grow">
        <h3 className="font-serif text-base md:text-lg text-gray-900 leading-tight group-hover:text-[#B08D55] transition-colors line-clamp-2">
          {item.name}
        </h3>
        <p className="text-[10px] md:text-[11px] text-gray-500 uppercase tracking-widest font-medium">
          {item.subCategory || item.category || 'Pure Silk'}
        </p>
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="font-bold text-sm md:text-base text-gray-900">
            ₹{formatPrice(item.price)}
          </span>
          {item.comparePrice > item.price && (
            <span className="text-xs text-gray-400 line-through decoration-gray-400 font-light">
              ₹{formatPrice(item.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProductCard = memo(ProductCardComponent, (prev, next) => {
  return prev.item.id === next.item.id && prev.isFavorite === next.isFavorite;
});