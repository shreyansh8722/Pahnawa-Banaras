import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Check, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const FREE_SHIPPING_THRESHOLD = 5000;

export const CartModal = () => {
  const { 
    cart, isCartOpen, closeCart, updateQuantity, removeFromCart, addToCart,
    subtotal, discount, cartTotal 
  } = useCart();

  const navigate = useNavigate();
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  // Fetch Suggestions
  useEffect(() => {
    if (isCartOpen && suggestedProducts.length === 0) {
      const fetchSuggestions = async () => {
        try {
          const q = query(collection(db, 'products'), orderBy('price', 'asc'), limit(4));
          const snap = await getDocs(q);
          const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setSuggestedProducts(products.filter(p => !cart.some(ci => ci.id === p.id)));
        } catch (e) { console.error(e); }
      };
      fetchSuggestions();
    }
  }, [isCartOpen, cart]);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout', { state: { cart, subtotal: cartTotal } });
  };

  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-[100dvh] w-full max-w-md bg-white z-[9999] shadow-2xl flex flex-col"
          >
            {/* 1. Header with Free Shipping Meter */}
            <div className="p-6 bg-white shrink-0 border-b border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-black flex items-center gap-3">
                   Shopping Bag <span className="text-sm font-sans text-gray-400 font-normal">({cart.length})</span>
                </h2>
                <button onClick={closeCart} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-black"><X size={20} /></button>
              </div>

              {/* Progress Bar - Minimalist Black/White */}
              <div className="bg-gray-50 rounded-sm p-4 border border-gray-100">
                 {remaining > 0 ? (
                    <p className="text-xs text-gray-600 mb-3 font-medium tracking-wide">
                       Add <span className="text-black font-bold">₹{remaining.toLocaleString()}</span> more for <span className="font-bold text-black uppercase">Free Shipping</span>
                    </p>
                 ) : (
                    <p className="text-xs text-black mb-3 font-bold flex items-center gap-2 uppercase tracking-wide">
                       <Check size={14} /> You've unlocked Free Shipping
                    </p>
                 )}
                 <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                       initial={{ width: 0 }} animate={{ width: `${progress}%` }} 
                       className="h-full bg-black" 
                    />
                 </div>
              </div>
            </div>

            {/* 2. Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
               {/* Cart Items */}
               {cart.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <p className="text-sm font-serif italic">Your bag is empty.</p>
                 </div>
               ) : (
                 cart.map((item) => (
                    <div key={item.cartItemId || item.id} className="flex gap-5 group">
                       <div className="w-24 h-32 bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                         <img src={item.featuredImageUrl} alt={item.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-serif text-base text-black line-clamp-2 leading-tight">{item.name}</h3>
                              <button onClick={() => removeFromCart(item.cartItemId || item.id)} className="text-gray-400 hover:text-black transition-colors"><Trash2 size={16} strokeWidth={1.5} /></button>
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.subCategory}</p>
                            {/* Display Options if they exist */}
                            {(item.selectedOptions?.fallPico || item.selectedOptions?.blouseStitching || item.selectedOptions?.tassels) && (
                                <div className="mt-2 text-[10px] text-gray-400 space-y-0.5">
                                    {item.selectedOptions.fallPico && <p>+ Fall & Pico</p>}
                                    {item.selectedOptions.blouseStitching && <p>+ Blouse Stitching</p>}
                                    {item.selectedOptions.tassels && <p>+ Tassels</p>}
                                </div>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-end">
                             <div className="flex items-center border border-gray-200 h-8">
                                <button onClick={() => updateQuantity(item.cartItemId || item.id, -1)} className="px-3 hover:bg-gray-50 text-black disabled:opacity-30" disabled={item.quantity <= 1}><Minus size={12} /></button>
                                <span className="w-8 text-center text-xs font-bold text-black">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.cartItemId || item.id, 1)} className="px-3 hover:bg-gray-50 text-black"><Plus size={12} /></button>
                             </div>
                             <span className="font-bold text-sm text-black">₹{formatPrice(item.price * item.quantity)}</span>
                          </div>
                       </div>
                    </div>
                 ))
               )}

               {/* 3. Cross-Sell / Upsell Section */}
               {suggestedProducts.length > 0 && (
                 <div className="pt-8 border-t border-gray-100">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-6 flex items-center gap-2">
                       <TrendingUp size={14} /> You might also like
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                       {suggestedProducts.map(p => (
                          <div key={p.id} className="min-w-[140px] w-[140px] bg-white group cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                             <div className="aspect-[3/4] bg-gray-50 mb-3 overflow-hidden relative">
                                <img src={p.featuredImageUrl} className="w-full h-full object-cover" />
                                {/* Add Button Overlay */}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); addToCart({...p, quantity: 1}); }}
                                  className="absolute bottom-0 left-0 right-0 bg-black text-white text-[10px] font-bold py-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                   Add to Bag
                                </button>
                             </div>
                             <p className="text-xs font-serif text-black truncate mb-1">{p.name}</p>
                             <p className="text-xs text-gray-500 font-medium">₹{formatPrice(p.price)}</p>
                          </div>
                       ))}
                    </div>
                 </div>
               )}
            </div>

            {/* 4. Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-white shrink-0 pb-safe">
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-gray-500 font-light"><span>Subtotal</span><span className="text-black font-medium">₹{formatPrice(subtotal)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-black"><span>Discount</span><span>- ₹{formatPrice(discount)}</span></div>}
                  <div className="flex justify-between text-gray-500 font-light"><span>Shipping</span><span className="text-black font-medium text-xs uppercase">Calculated at Checkout</span></div>
                  <div className="flex justify-between text-lg font-serif text-black pt-4 border-t border-gray-100 mt-2"><span>Total</span><span>₹{formatPrice(cartTotal)}</span></div>
                </div>
                <button 
                  onClick={handleCheckout} 
                  className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-all flex items-center justify-center gap-3 rounded-sm"
                >
                  Checkout <ArrowRight size={16} />
                </button>
                <p className="text-[10px] text-center text-gray-400 mt-4 uppercase tracking-widest">
                   Secure Checkout • Free Returns
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};