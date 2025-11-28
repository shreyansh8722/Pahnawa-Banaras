import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Zap } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export const StickyActionBar = ({ product, isOutOfStock, onAddToCart, onBuyNow }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show bar after scrolling down 600px (past the main image/button usually)
      if (window.scrollY > 600) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-3 md:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-safe"
        >
          <div className="flex gap-3 items-center">
             <div className="flex-1">
                <p className="text-xs font-medium text-gray-900 line-clamp-1">{product.name}</p>
                <p className="text-xs font-bold text-[#B08D55]">₹{formatPrice(product.price)}</p>
             </div>
             <div className="flex gap-2">
                <button 
                  onClick={onAddToCart}
                  disabled={isOutOfStock}
                  className="bg-gray-100 text-gray-900 px-4 py-3 rounded-sm font-bold uppercase text-[10px] disabled:opacity-50"
                >
                  <ShoppingBag size={16} />
                </button>
                <button 
                  onClick={onBuyNow}
                  disabled={isOutOfStock}
                  className="bg-[#B08D55] text-white px-6 py-3 rounded-sm font-bold uppercase text-[10px] tracking-wider disabled:bg-gray-400"
                >
                  {isOutOfStock ? 'Sold Out' : 'Buy Now'}
                </button>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};