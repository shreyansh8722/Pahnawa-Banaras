import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/lib/utils';
import { LazyImage } from '@/components/LazyImage';
import { useCart } from '@/context/CartContext';
import { Plus } from 'lucide-react';

export const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ ...item, quantity: 1 });
  };

  return (
    <div 
      className="group cursor-pointer flex flex-col space-y-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${item.id}`)}
    >
      {/* IMAGE CONTAINER - Aspect Ratio 3:4 for that "Fashion Editorial" look */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-heritage-sand/20">
        
        {/* Primary Image */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
           <LazyImage src={item.featuredImageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>
        
        {/* Secondary (Hover) Image - Slow zoom effect */}
        <div className={`absolute inset-0 transition-all duration-1000 ease-out ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}>
           <LazyImage src={item.imageUrls?.[1] || item.featuredImageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>

        {/* 'QUICK ADD' SLIDE-UP BAR */}
        <div 
          onClick={handleAddToCart}
          className={`absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm py-3 px-5 flex justify-between items-center transition-transform duration-500 border-t border-heritage-border/50 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}
        >
           <span className="text-[10px] uppercase tracking-widest text-heritage-charcoal font-medium hover:text-heritage-gold transition-colors">
             Quick Add
           </span>
           <Plus size={14} className="text-heritage-charcoal" strokeWidth={1} />
        </div>
      </div>

      {/* MINIMAL METADATA - Centered for elegance */}
      <div className="text-center space-y-1">
        <h3 className="font-serif text-lg text-heritage-charcoal font-light group-hover:text-heritage-gold transition-colors duration-500">
          {item.name}
        </h3>
        
        <div className="text-[10px] text-heritage-grey uppercase tracking-widest">
           {item.subCategory} <span className="mx-1">•</span> ₹{formatPrice(item.price)}
        </div>
      </div>
    </div>
  );
};