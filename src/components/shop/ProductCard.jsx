import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyImage } from '@/components/LazyImage';

export const ProductCard = ({ item, onAddToCart }) => {
  const navigate = useNavigate();
  const imageSrc = item.featuredImageUrl || item.imageUrls?.[0] || 'https://placehold.co/600x900';

  return (
    <div 
      className="group cursor-pointer flex flex-col"
      onClick={() => navigate(`/product/${item.id}`)}
    >
      {/* Image Container - 2:3 Aspect Ratio */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-white mb-3 shadow-sm rounded-sm">
        <LazyImage
          src={imageSrc}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
        />
        
        {/* Quick Add Button - Hidden on Mobile, Visible on Desktop */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 p-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className="w-full bg-white/95 text-brand-primary py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-colors"
          >
            Quick Add
          </button>
        </div>

        {/* Sale Tag */}
        {item.comparePrice > item.price && (
          <span className="absolute top-0 left-0 bg-brand-primary text-white text-[8px] md:text-[9px] font-bold px-2 py-1 md:px-3 md:py-1.5 uppercase tracking-wider">
            Sale
          </span>
        )}
      </div>

      {/* Minimal Details */}
      <div className="text-center space-y-1 px-1">
        <h3 className="font-serif text-sm md:text-lg text-brand-dark group-hover:text-brand-primary transition-colors leading-tight line-clamp-1">
          {item.name}
        </h3>
        <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-wider">
          {item.material || 'Pure Silk'}
        </p>
        <div className="flex justify-center items-center gap-2 pt-0.5">
          <span className="font-sans font-bold text-xs md:text-sm text-brand-dark">
            ₹{item.price?.toLocaleString('en-IN')}
          </span>
          {item.comparePrice > 0 && (
            <span className="font-sans text-[10px] md:text-xs text-gray-400 line-through">
              ₹{item.comparePrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};