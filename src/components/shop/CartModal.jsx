import React, { useState, useEffect } from 'react';
// --- FIX: Added ArrowRight to imports below ---
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Ticket, Check, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth'; 

export const CartModal = () => {
  const { 
    cart, isCartOpen, closeCart, updateQuantity, removeFromCart, addToCart,
    subtotal, discount, cartTotal, 
    applyPromoCode, removePromoCode, appliedPromo, promoError, availableCoupons 
  } = useCart();

  const { user } = useAuth(); 
  
  const [couponInput, setCouponInput] = useState('');
  const [showCoupons, setShowCoupons] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch suggestions when cart is empty
  useEffect(() => {
    if (isCartOpen && cart.length === 0 && suggestedProducts.length === 0) {
      const fetchSuggestions = async () => {
        try {
          const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(3));
          const snap = await getDocs(q);
          setSuggestedProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) { console.error(e); }
      };
      fetchSuggestions();
    }
  }, [isCartOpen, cart.length]);

  const handleApply = () => {
    if (!couponInput.trim()) return;
    const success = applyPromoCode(couponInput);
    if (success) setCouponInput('');
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout', { state: { cart, subtotal: cartTotal } });
  };

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
            {/* Header - Simplified to just X for clean look */}
            <div className="p-5 flex justify-end items-center bg-white shrink-0">
              <button onClick={closeCart} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                <X size={24} className="text-gray-800" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center -mt-10">
                  
                  {/* Empty State Text */}
                  <h2 className="font-serif text-2xl text-gray-900 mb-8">Your cart is empty</h2>
                  
                  {/* Continue Shopping Button */}
                  <button 
                    onClick={closeCart}
                    className="w-full bg-[#B08D55] text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#8c6a40] transition-all shadow-sm rounded-sm mb-10"
                  >
                    Continue Shopping
                  </button>

                  {/* Login Prompt (Only if not logged in) */}
                  {!user && (
                    <div className="space-y-1">
                       <p className="text-sm text-gray-900 font-medium">Have an account?</p>
                       <p className="text-sm text-gray-500">
                         <Link 
                           to="/login" 
                           onClick={closeCart}
                           className="text-gray-900 underline decoration-gray-400 underline-offset-4 hover:text-[#B08D55] hover:decoration-[#B08D55] transition-all"
                         >
                           Log in
                         </Link> to check out faster.
                       </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="font-serif text-xl text-gray-900">Shopping Bag ({cart.length})</h2>
                  </div>

                  {cart.map((item) => (
                    <div key={item.cartItemId || item.id} className="flex gap-4 group">
                       <div className="w-20 h-28 bg-gray-100 rounded-md overflow-hidden shrink-0 relative border border-gray-100">
                         <img src={item.featuredImageUrl || item.imageUrls?.[0]} alt={item.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-serif text-base text-gray-900 line-clamp-1 pr-4 cursor-pointer hover:text-[#B08D55] transition-colors" onClick={() => { closeCart(); navigate(`/product/${item.id}`); }}>{item.name}</h3>
                              <button onClick={() => removeFromCart(item.cartItemId || item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.subCategory}</p>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                             <div className="flex items-center border border-gray-200 rounded-sm h-7">
                                <button onClick={() => updateQuantity(item.cartItemId || item.id, -1)} className="px-2.5 hover:bg-gray-50 text-gray-500 transition-colors" disabled={item.quantity <= 1}><Minus size={10} /></button>
                                <span className="w-6 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.cartItemId || item.id, 1)} className="px-2.5 hover:bg-gray-50 text-gray-900 transition-colors"><Plus size={10} /></button>
                             </div>
                             <span className="font-bold text-sm text-gray-900">₹{formatPrice(item.price * item.quantity)}</span>
                          </div>
                       </div>
                    </div>
                  ))}

                  <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
                    {appliedPromo ? (
                      <div className="bg-green-50 border border-green-100 p-3 rounded-sm flex justify-between items-center animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-500 text-white p-1 rounded-full"><Check size={12} /></div>
                          <div>
                            <p className="text-xs font-bold text-green-800 uppercase tracking-wider">'{appliedPromo.code}' Applied</p>
                            <p className="text-[10px] text-green-600 font-medium">{appliedPromo.description}</p>
                          </div>
                        </div>
                        <button onClick={removePromoCode} className="text-[10px] text-red-500 font-bold hover:underline uppercase tracking-wider">Remove</button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Ticket size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                              type="text" 
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                              placeholder="Enter Promo Code" 
                              className="w-full border border-gray-200 rounded-sm pl-10 pr-3 py-2.5 text-sm focus:border-[#B08D55] outline-none uppercase placeholder:normal-case bg-gray-50 focus:bg-white transition-colors"
                            />
                          </div>
                          <button onClick={handleApply} disabled={!couponInput} className="bg-black text-white px-5 rounded-sm text-xs font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors">Apply</button>
                        </div>
                        
                        {promoError && (
                          <p className="text-xs text-red-500 flex items-center gap-1.5 bg-red-50 p-2 rounded-sm border border-red-100 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle size={12} /> {promoError}
                          </p>
                        )}
                        
                        <div className="pt-2">
                          <button onClick={() => setShowCoupons(!showCoupons)} className="text-[11px] text-[#B08D55] font-bold uppercase flex items-center gap-1 hover:underline tracking-wider">
                            View Available Offers {showCoupons ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                          </button>
                          <AnimatePresence>
                            {showCoupons && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="space-y-2 pt-3">
                                  {availableCoupons.map((c) => (
                                    <div key={c.code} className="border border-gray-200 p-3 rounded-sm bg-white flex justify-between items-center hover:border-[#B08D55] transition-colors cursor-pointer" onClick={() => applyPromoCode(c.code)}>
                                      <div><p className="font-bold text-xs text-gray-800 border-b border-dashed border-gray-300 inline-block pb-0.5 mb-1">{c.code}</p><p className="text-[10px] text-gray-500">{c.description}</p></div>
                                      <button className="text-[10px] font-bold text-[#B08D55] border border-[#B08D55] px-3 py-1.5 rounded-sm uppercase tracking-wider">Apply</button>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-white shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{formatPrice(subtotal)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-green-700 font-medium"><span>Discount</span><span>- ₹{formatPrice(discount)}</span></div>}
                  <div className="flex justify-between text-gray-500"><span>Shipping</span><span className="text-green-700 font-bold text-xs uppercase">Free</span></div>
                  <div className="flex justify-between text-xl font-serif font-bold text-gray-900 pt-3 border-t border-dashed border-gray-200 mt-2"><span>Total</span><span>₹{formatPrice(cartTotal)}</span></div>
                </div>
                <button onClick={handleCheckout} className="w-full bg-[#B08D55] text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#8c6a40] transition-all shadow-lg flex items-center justify-center gap-2 rounded-sm active:scale-[0.98]">
                  {/* --- FIX: ArrowRight is used here --- */}
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};