import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyImage } from '@/components/LazyImage';
import { Heart, ShoppingBag } from 'lucide-react';

export const ProductCard = ({ item, onAddToCart, onToggleFavorite, isFavorite }) => {
  const navigate = useNavigate();

  // 1. Smart Image Handling
  // Primary image for display
  const imageSrc = useMemo(() => 
    item.featuredImageUrl || item.imageUrls?.[0] || 'https://placehold.co/600x900', 
  [item]);
  
  // Secondary image for hover effect (falls back to primary if no second image)
  const hoverImageSrc = useMemo(() => 
    (item.imageUrls && item.imageUrls.length > 1) ? item.imageUrls[1] : imageSrc, 
  [item, imageSrc]);

  // Calculate discount percentage
  const discountPercentage = item.comparePrice > item.price
    ? Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)
    : 0;

  return (
    <div 
      className="group relative cursor-pointer flex flex-col gap-3"
      onClick={() => navigate(`/product/${item.id}`)}
    >
      {/* --- IMAGE CONTAINER --- */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-gray-100 rounded-sm">
        
        {/* Primary Image (Fades out on hover) */}
        <div className="absolute inset-0 transition-opacity duration-700 ease-in-out group-hover:opacity-0 z-10">
          <LazyImage
            src={imageSrc}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Secondary Image (Visible on hover) */}
        <img
          src={hoverImageSrc}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover z-0"
          loading="lazy"
        />

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleFavorite) onToggleFavorite(item.id);
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-300 z-20 opacity-100 md:opacity-0 md:translate-y-[-10px] md:group-hover:opacity-100 md:group-hover:translate-y-0 shadow-sm"
          title="Add to Wishlist"
        >
          <Heart 
            size={18} 
            fill={isFavorite ? "currentColor" : "none"} 
            className={isFavorite ? "text-red-500" : ""} 
          />
        </button>

        {/* Sale Tag (Top Left) */}
        {discountPercentage > 0 && (
          <span className="absolute top-2 left-2 z-20 bg-[#B08D55] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm shadow-sm">
            -{discountPercentage}% OFF
          </span>
        )}

        {/* Quick Add Button (Slides Up) */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-0 md:p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hidden md:block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className="w-full bg-white text-brand-dark py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-colors shadow-lg flex items-center justify-center gap-2 rounded-sm border border-gray-100"
          >
            <ShoppingBag size={14} /> Quick Add
          </button>
        </div>
      </div>

      {/* --- PRODUCT DETAILS --- */}
      <div className="flex flex-col gap-1 px-1">
        {/* Title */}
        <h3 className="font-serif text-base md:text-lg text-gray-900 leading-tight group-hover:text-[#B08D55] transition-colors line-clamp-1">
          {item.name}
        </h3>

        {/* Category / Material */}
        <p className="text-[10px] md:text-[11px] text-gray-500 uppercase tracking-widest font-medium">
          {item.subCategory || item.category || 'Pure Silk'}
        </p>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-bold text-sm md:text-base text-gray-900">
            ₹{item.price?.toLocaleString('en-IN')}
          </span>
          {item.comparePrice > item.price && (
            <span className="text-xs text-gray-400 line-through decoration-gray-400 font-light">
              ₹{item.comparePrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};