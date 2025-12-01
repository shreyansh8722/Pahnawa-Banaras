import React from 'react';
import { X, Minus, Plus, ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/lib/utils';
import { LazyImage } from '@/components/LazyImage';

export const CartModal = () => {
  const { isCartOpen, closeCart, cart, removeFromCart, updateQuantity, subtotal, cartTotal } = useCart();
  const navigate = useNavigate();

  const FREE_SHIPPING_LIMIT = 10000;
  const progress = Math.min((subtotal / FREE_SHIPPING_LIMIT) * 100, 100);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
            className="fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} strokeWidth={1.5} className="text-heritage-charcoal" />
                {/* UPDATED TEXT HERE */}
                <h2 className="font-serif text-2xl text-heritage-charcoal italic">Your Shopping Bag</h2>
                <span className="text-xs font-bold bg-heritage-sand px-2 py-1 rounded-full text-heritage-charcoal">
                  {cart.length}
                </span>
              </div>
              <button onClick={closeCart} className="p-2 hover:rotate-90 transition-transform duration-300">
                <X size={24} strokeWidth={1} className="text-heritage-charcoal" />
              </button>
            </div>

            {/* Free Shipping Bar */}
            <div className="px-8 py-4 bg-heritage-sand/30 border-b border-gray-100">
               <p className="text-xs font-bold uppercase tracking-widest text-heritage-grey mb-2">
                 {subtotal >= FREE_SHIPPING_LIMIT 
                   ? "You are eligible for Complimentary Shipping" 
                   : `Add ₹${formatPrice(FREE_SHIPPING_LIMIT - subtotal)} for Free Shipping`
                 }
               </p>
               <div className="w-full h-[2px] bg-gray-200">
                 <div 
                   className="h-full bg-heritage-gold transition-all duration-500" 
                   style={{ width: `${progress}%` }} 
                 />
               </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="font-serif text-xl italic">Your bag is empty.</p>
                  <button onClick={() => { closeCart(); navigate('/shop'); }} className="text-xs uppercase underline tracking-widest">
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartItemId} className="flex gap-6 group">
                    {/* Image */}
                    <div className="w-24 aspect-[3/4] bg-gray-50 relative shrink-0 overflow-hidden border border-gray-100">
                      <LazyImage 
                        src={item.featuredImageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-serif text-lg text-heritage-charcoal leading-tight cursor-pointer hover:text-heritage-gold transition-colors" onClick={()=>{ closeCart(); navigate(`/product/${item.id}`); }}>
                            {item.name}
                          </h3>
                          <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 size={16} strokeWidth={1} />
                          </button>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-heritage-grey mb-2">
                          {item.subCategory}
                        </p>
                        {/* Options */}
                        <div className="flex flex-wrap gap-1">
                          {item.selectedOptions?.fallPico && (
                            <span className="text-[9px] uppercase tracking-wider text-heritage-gold bg-heritage-gold/10 px-1.5 py-0.5 rounded-sm">
                              Fall/Pico
                            </span>
                          )}
                          {item.selectedOptions?.blouseStitching && (
                            <span className="text-[9px] uppercase tracking-wider text-heritage-gold bg-heritage-gold/10 px-1.5 py-0.5 rounded-sm">
                              Blouse Stitching
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-2">
                        {/* Qty Control */}
                        <div className="flex items-center border border-gray-200">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            className="p-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-medium font-sans">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            className="p-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        
                        {/* Price */}
                        <p className="font-sans font-medium text-sm text-heritage-charcoal">
                          ₹{formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-gray-100 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif text-xl italic text-heritage-charcoal">Subtotal</span>
                  <span className="font-sans text-lg font-medium text-heritage-charcoal">₹{formatPrice(cartTotal)}</span>
                </div>
                <p className="text-[10px] text-gray-400 mb-6 text-center">
                  Shipping & taxes calculated at checkout.
                </p>
                <button 
                  onClick={() => { closeCart(); navigate('/checkout'); }}
                  className="w-full bg-heritage-charcoal text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-heritage-gold transition-colors duration-300 flex items-center justify-center gap-2"
                >
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