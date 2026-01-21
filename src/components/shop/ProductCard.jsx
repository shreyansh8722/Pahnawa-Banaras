import React, { useState } from 'react';
import { Heart, Eye } from 'lucide-react';
import { QuickViewModal } from './QuickViewModal';
import { Link } from 'react-router-dom';

export const ProductCard = ({ item, onAddToCart, isFavorite, onToggleFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  if (!item) return null;

  // --- FIX: Mapping to your Database Fields ---
  // Priority: 1. featuredImageUrl -> 2. imageUrls[0] -> 3. image (fallback)
  const mainImage = item.featuredImageUrl || (item.imageUrls && item.imageUrls[0]) || item.image || "";
  
  // Secondary image for hover effect
  const hoverImage = (item.imageUrls && item.imageUrls.length > 1) ? item.imageUrls[1] : null;

  return (
    <>
      <div 
        className="group relative flex flex-col w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* IMAGE CONTAINER */}
        <Link to={`/product/${item.id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-royal-sand mb-4 block">
          {mainImage ? (
            <img 
              src={mainImage} 
              alt={item.name || "Product"}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.style.display = 'none'; // Hide if broken
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-royal-grey bg-royal-border/20 text-xs uppercase tracking-widest">
               No Image
            </div>
          )}
          
          {/* HOVER IMAGE */}
          {hoverImage && (
             <img 
               src={hoverImage} 
               alt={item.name}
               className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
             />
          )}

          {/* OVERLAY BUTTONS */}
          <div className={`absolute inset-x-0 bottom-4 flex justify-center gap-2 px-4 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
             <button 
                onClick={(e) => { e.preventDefault(); setShowQuickView(true); }}
                className="bg-white text-royal-charcoal p-3 hover:bg-royal-gold hover:text-white transition-colors duration-200 shadow-lg rounded-sm"
                title="Quick View"
             >
                <Eye size={18} />
             </button>

             <button 
                onClick={(e) => { e.preventDefault(); onAddToCart && onAddToCart(item); }}
                className="flex-1 bg-royal-maroon text-white h-[42px] flex items-center justify-center text-[10px] font-bold uppercase tracking-widest hover:bg-royal-charcoal transition-colors duration-200 shadow-lg"
             >
                Add to Cart
             </button>
          </div>

          {/* WISHLIST BUTTON */}
          <button 
            onClick={(e) => { e.preventDefault(); onToggleFavorite && onToggleFavorite(item.id); }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-royal-maroon transition-all duration-200 z-20 shadow-sm"
          >
            <Heart size={18} className={isFavorite ? "fill-royal-maroon" : ""} strokeWidth={1.5} />
          </button>
        </Link>

        {/* DETAILS */}
        <div className="text-center space-y-1">
          <Link to={`/product/${item.id}`}>
            <h3 className="font-serif text-lg text-royal-charcoal group-hover:text-royal-maroon transition-colors duration-200 line-clamp-1">
              {item.name || "Unnamed Product"}
            </h3>
          </Link>
          <p className="text-[10px] font-sans text-royal-grey uppercase tracking-widest">{item.category || "General"}</p>
          <div className="flex justify-center gap-2 items-center text-royal-gold font-medium mt-1">
             <span>₹{item.price ? item.price.toLocaleString() : "0"}</span>
             {item.originalPrice && (
               <span className="text-xs text-royal-border line-through">₹{item.originalPrice.toLocaleString()}</span>
             )}
          </div>
        </div>
      </div>

      <QuickViewModal 
        item={item} 
        isOpen={showQuickView} 
        onClose={() => setShowQuickView(false)} 
        onAddToCart={onAddToCart}
      />
    </>
  );
};