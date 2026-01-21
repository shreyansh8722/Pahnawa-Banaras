import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickViewModal = ({ item, isOpen, onClose, onAddToCart }) => {
  if (!isOpen || !item) return null;

  // --- FIX: Image Mapping ---
  const image = item.featuredImageUrl || (item.imageUrls && item.imageUrls[0]) || item.image;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} 
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
        />
        
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-royal-cream w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row rounded-sm z-10"
        >
            <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full hover:bg-royal-maroon hover:text-white transition-colors">
                <X size={20} />
            </button>

            <div className="w-full md:w-1/2 bg-royal-sand relative min-h-[300px]">
                {image && <img src={image} alt={item.name} className="w-full h-full object-cover absolute inset-0" />}
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-left">
                <span className="text-royal-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-3">{item.category}</span>
                <h2 className="font-display text-3xl text-royal-charcoal mb-4">{item.name}</h2>
                <div className="text-2xl text-royal-maroon font-serif mb-6">₹{item.price?.toLocaleString()}</div>
                <p className="text-royal-grey font-sans text-sm leading-relaxed mb-8">{item.fullDescription?.substring(0, 140) || item.description?.substring(0, 140)}...</p>

                <div className="space-y-4 mb-8">
                    <button onClick={() => { onAddToCart && onAddToCart(item); onClose(); }} className="w-full py-4 bg-royal-maroon text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-royal-charcoal transition-colors">
                        Add to Cart
                    </button>
                    <Link to={`/product/${item.id}`} className="flex items-center justify-center gap-2 w-full text-center py-4 border border-royal-charcoal text-royal-charcoal text-xs font-bold uppercase tracking-[0.2em] hover:bg-royal-charcoal hover:text-white transition-colors">
                        View Details <ArrowRight size={14}/>
                    </Link>
                </div>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};