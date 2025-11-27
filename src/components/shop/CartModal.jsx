import React, { useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

export const CartModal = () => {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    subtotal 
  } = useCart();
  
  const navigate = useNavigate();

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout', { state: { cart, subtotal } });
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Dark Backdrop - High Z-Index */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          
          {/* Cart Drawer - Highest Z-Index */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[9999] shadow-2xl flex flex-col"
            style={{ position: 'fixed', height: '100vh' }} // Force viewport height
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <h2 className="font-serif text-xl text-gray-900 flex items-center gap-2">
                <ShoppingBag size={20} /> Your Bag <span className="text-gray-400 text-sm">({cart.length})</span>
              </h2>
              <button onClick={closeCart} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                <X size={22} className="text-gray-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="text-gray-400" />
                  </div>
                  <p className="text-base font-medium text-gray-600">Your bag is empty.</p>
                  <button 
                    onClick={closeCart}
                    className="text-[#B08D55] text-xs font-bold uppercase tracking-widest border-b border-[#B08D55] pb-1"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartItemId || item.id} className="flex gap-4 group">
                     <div className="w-24 h-32 bg-gray-100 rounded-sm overflow-hidden shrink-0 relative">
                       <img 
                         src={item.featuredImageUrl || item.imageUrls?.[0]} 
                         alt={item.name} 
                         className="w-full h-full object-cover"
                       />
                     </div>
                     
                     <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-serif text-base text-gray-900 line-clamp-2 pr-2 leading-tight">
                              {item.name}
                            </h3>
                            <button 
                              onClick={() => removeFromCart(item.cartItemId || item.id)} 
                              className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                            {item.subCategory || 'Silk Saree'}
                            {item.selectedOptions?.fallPico && <span> • Fall/Pico</span>}
                            {item.selectedOptions?.blouseStitching && <span> • Blouse Stitching</span>}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-end">
                           <div className="flex items-center border border-gray-200 rounded-sm h-8 w-24">
                              <button 
                                onClick={() => updateQuantity(item.cartItemId || item.id, -1)}
                                className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 disabled:opacity-40"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="flex-1 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.cartItemId || item.id, 1)}
                                className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600"
                              >
                                <Plus size={12} />
                              </button>
                           </div>
                           
                           <div className="text-right">
                              <span className="block font-bold text-sm text-gray-900">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-5 bg-white shrink-0 pb-safe">
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold text-xs uppercase">Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-serif font-bold text-gray-900 pt-3 border-t border-dashed border-gray-200">
                    <span>Total</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#B08D55] text-white py-4 text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#8c6a40] transition-all shadow-lg flex items-center justify-center gap-2 rounded-sm active:scale-[0.98]"
                >
                  CHECKOUT <ArrowRight size={16} />
                </button>
                
                <div className="mt-4 flex justify-center items-center gap-2 text-[10px] text-gray-400 uppercase tracking-wider">
                  <ShieldCheck size={12} /> Secure Payment & Data Protection
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};