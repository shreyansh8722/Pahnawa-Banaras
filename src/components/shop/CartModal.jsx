import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Ticket, Check, ChevronDown, ChevronUp, AlertCircle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth'; 

const FREE_SHIPPING_THRESHOLD = 5000; // Example: Free shipping above ₹5000

export const CartModal = () => {
  const { 
    cart, isCartOpen, closeCart, updateQuantity, removeFromCart, addToCart,
    subtotal, discount, cartTotal, 
    applyPromoCode, removePromoCode, appliedPromo, promoError, availableCoupons 
  } = useCart();

  const { user } = useAuth(); 
  const navigate = useNavigate();
  
  const [couponInput, setCouponInput] = useState('');
  const [showCoupons, setShowCoupons] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  // Fetch Suggestions
  useEffect(() => {
    if (isCartOpen && suggestedProducts.length === 0) {
      const fetchSuggestions = async () => {
        try {
          // Fetch simple products to upsell
          const q = query(collection(db, 'products'), orderBy('price', 'asc'), limit(4));
          const snap = await getDocs(q);
          const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          // Filter out items already in cart
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

  // Progress Bar Calculation
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
            <div className="p-5 bg-white shrink-0 border-b border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-serif text-xl text-gray-900 flex items-center gap-2">
                   Shopping Bag <span className="text-sm font-sans text-gray-400 font-normal">({cart.length} Items)</span>
                </h2>
                <button onClick={closeCart} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><X size={20} /></button>
              </div>

              {/* Progress Bar */}
              <div className="bg-gray-50 rounded-lg p-3">
                 {remaining > 0 ? (
                    <p className="text-xs text-gray-600 mb-2 font-medium">
                       Add <span className="text-[#B08D55] font-bold">₹{remaining.toLocaleString()}</span> more for <span className="font-bold">Free Shipping</span>
                    </p>
                 ) : (
                    <p className="text-xs text-green-700 mb-2 font-bold flex items-center gap-1">
                       <Check size={12} /> You've unlocked Free Shipping!
                    </p>
                 )}
                 <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                       initial={{ width: 0 }} animate={{ width: `${progress}%` }} 
                       className={`h-full ${remaining <= 0 ? 'bg-green-500' : 'bg-[#B08D55]'}`} 
                    />
                 </div>
              </div>
            </div>

            {/* 2. Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
               {/* Cart Items */}
               {cart.map((item) => (
                  <div key={item.cartItemId || item.id} className="flex gap-4 group">
                     <div className="w-20 h-24 bg-gray-100 rounded-sm overflow-hidden shrink-0 border border-gray-100">
                       <img src={item.featuredImageUrl} alt={item.name} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{item.name}</h3>
                            <button onClick={() => removeFromCart(item.cartItemId || item.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                          </div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{item.subCategory}</p>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center border border-gray-200 rounded-sm h-6">
                              <button onClick={() => updateQuantity(item.cartItemId || item.id, -1)} className="px-2 hover:bg-gray-50 text-gray-500" disabled={item.quantity <= 1}><Minus size={10} /></button>
                              <span className="w-6 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.cartItemId || item.id, 1)} className="px-2 hover:bg-gray-50 text-gray-900"><Plus size={10} /></button>
                           </div>
                           <span className="font-bold text-sm text-gray-900">₹{formatPrice(item.price * item.quantity)}</span>
                        </div>
                     </div>
                  </div>
               ))}

               {/* 3. Cross-Sell / Upsell Section */}
               {suggestedProducts.length > 0 && (
                 <div className="pt-6 border-t border-dashed border-gray-200">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                       <TrendingUp size={14} /> You might also like
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                       {suggestedProducts.map(p => (
                          <div key={p.id} className="min-w-[120px] w-[120px] bg-white border border-gray-100 rounded-sm p-2 group">
                             <div className="aspect-[3/4] bg-gray-100 mb-2 overflow-hidden relative">
                                <img src={p.featuredImageUrl} className="w-full h-full object-cover" />
                                {/* Add Button Overlay */}
                                <button 
                                  onClick={() => addToCart({...p, quantity: 1})}
                                  className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[10px] font-bold py-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                   ADD
                                </button>
                             </div>
                             <p className="text-xs font-medium text-gray-900 truncate">{p.name}</p>
                             <p className="text-xs text-[#B08D55] font-bold">₹{formatPrice(p.price)}</p>
                          </div>
                       ))}
                    </div>
                 </div>
               )}

               {/* Coupon Section (Kept as is, just wrapped in detail/summary logic usually) */}
               {/* ... Keep existing Coupon Logic here ... */}
            </div>

            {/* 4. Footer */}
            <div className="border-t border-gray-100 p-6 bg-white shrink-0 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.1)] pb-safe">
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{formatPrice(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>- ₹{formatPrice(discount)}</span></div>}
                <div className="flex justify-between text-gray-500"><span>Shipping</span><span className="text-green-700 font-bold text-xs uppercase">Free</span></div>
                <div className="flex justify-between text-xl font-serif font-bold text-gray-900 pt-3 border-t border-gray-100 mt-2"><span>Total</span><span>₹{formatPrice(cartTotal)}</span></div>
              </div>
              <button 
                onClick={handleCheckout} 
                className="w-full bg-[#B08D55] text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#8c6a40] transition-all shadow-lg flex items-center justify-center gap-2 rounded-sm active:scale-[0.98]"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};