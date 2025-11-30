import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/lib/utils';

export const ProductCard = ({ item }) => {
  const navigate = useNavigate();

  // Safety check
  if (!item) return null;

  // Image Logic: Prefer the second image for hover if available, otherwise just zoom the first
  const mainImage = item.featuredImageUrl || item.imageUrls?.[0] || 'https://placehold.co/400x600?text=Pahnawa';
  const hoverImage = item.imageUrls?.[1] || mainImage; // Fallback to main if no second image

  return (
    <div 
      onClick={() => navigate(`/product/${item.id}`)}
      className="group cursor-pointer flex flex-col gap-2 relative"
    >
      {/* 1. Image Container - STRICT PORTRAIT ASPECT RATIO (3:4) */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#F5F2EB]">
        
        {/* Hover Image (Bottom Layer) */}
        <img 
          src={hoverImage} 
          alt={item.name} 
          className="absolute inset-0 w-full h-full object-cover z-0"
          loading="lazy"
        />

        {/* Main Image (Top Layer) - Fades out on hover */}
        {/* Using a faster duration (200ms) for a snappier swap effect */}
        <img 
          src={mainImage} 
          alt={item.name} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ease-linear z-10 ${hoverImage !== mainImage ? 'group-hover:opacity-0' : ''}`}
          loading="lazy"
        />

        {/* Sold Out Badge - Minimalist */}
        {item.stock === 0 && (
          <div className="absolute top-2 left-2 bg-heritage-charcoal text-white text-[8px] uppercase tracking-widest px-2 py-1 z-20">
            Sold Out
          </div>
        )}
      </div>

      {/* 2. Minimalist Details - Refined Typography */}
      <div className="text-center mt-1 px-1">
        {/* Product Name: Smaller, Serif, Dark Grey */}
        <h3 className="font-serif text-sm md:text-[15px] text-heritage-charcoal/90 group-hover:text-heritage-gold transition-colors duration-300 line-clamp-1 leading-tight">
          {item.name}
        </h3>
        
        {/* Price: Bold, Black, slightly smaller than name */}
        <p className="font-sans text-xs md:text-sm font-bold text-black mt-1">
          {formatPrice(item.price)}
        </p>
      </div>
    </div>
  );
};