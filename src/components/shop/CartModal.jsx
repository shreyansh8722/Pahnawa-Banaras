import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/lib/utils';

export const CartModal = ({ open, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  // Prevent background scrolling when cart is open
  React.useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-[#FDFBF7] z-[101] shadow-2xl flex flex-col border-l border-[#C5A059]/30"
          >
             {/* Header */}
             <div className="flex items-center justify-between p-6 border-b border-[#E6DCCA]">
                <div className="flex items-center gap-3">
                   <ShoppingBag size={20} className="text-[#C5A059]" />
                   <h2 className="font-display text-2xl text-[#2D2424]">Your Bag ({cartItems.length})</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-[#F4F1EA] rounded-full transition-colors text-[#6B6060]">
                   <X size={20} />
                </button>
             </div>

             {/* Items List */}
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                      <ShoppingBag size={48} className="mb-4 text-[#E6DCCA]" />
                      <p className="font-serif text-lg text-[#2D2424]">Your wardrobe is empty.</p>
                      <button onClick={onClose} className="mt-4 text-xs font-bold uppercase tracking-widest text-[#701a1a] border-b border-[#701a1a]">Start Shopping</button>
                   </div>
                ) : (
                   cartItems.map(item => (
                      <motion.div layout key={`${item.id}-${item.selectedOptions?.size}`} className="flex gap-4 bg-white p-3 rounded-sm border border-[#E6DCCA]">
                         <div className="w-20 h-24 bg-[#F4F1EA] shrink-0">
                            <img src={item.featuredImageUrl} alt={item.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 flex flex-col justify-between">
                            <div>
                               <div className="flex justify-between items-start">
                                  <h3 className="font-serif text-[#2D2424] line-clamp-1">{item.name}</h3>
                                  <button onClick={() => removeFromCart(item.id)} className="text-[#E6DCCA] hover:text-red-700 transition-colors"><Trash2 size={14}/></button>
                               </div>
                               <p className="text-[10px] uppercase tracking-widest text-[#6B6060] mt-1">{item.category}</p>
                               {item.selectedOptions && (
                                  <div className="flex gap-2 mt-1 flex-wrap">
                                    {Object.entries(item.selectedOptions).map(([key, val]) => val && (
                                       <span key={key} className="text-[9px] bg-[#F4F1EA] px-1.5 py-0.5 rounded text-[#2D2424] capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    ))}
                                  </div>
                               )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                               <div className="flex items-center border border-[#E6DCCA] rounded-sm h-7">
                                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 h-full hover:bg-[#F4F1EA]"><Minus size={10} /></button>
                                  <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 h-full hover:bg-[#F4F1EA]"><Plus size={10} /></button>
                               </div>
                               <span className="font-bold text-[#701a1a] text-sm">₹{formatPrice(item.price * item.quantity)}</span>
                            </div>
                         </div>
                      </motion.div>
                   ))
                )}
             </div>

             {/* Footer */}
             {cartItems.length > 0 && (
                <div className="p-6 bg-white border-t border-[#E6DCCA] space-y-4">
                   <div className="space-y-2">
                      <div className="flex justify-between text-sm text-[#6B6060]">
                         <span>Subtotal</span>
                         <span>₹{formatPrice(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-[#6B6060]">
                         <span>Shipping</span>
                         <span className="text-green-700 font-bold uppercase text-[10px]">Free</span>
                      </div>
                      <div className="flex justify-between text-lg font-serif text-[#2D2424] pt-2 border-t border-[#E6DCCA] mt-2">
                         <span>Total</span>
                         <span className="font-bold text-[#701a1a]">₹{formatPrice(cartTotal)}</span>
                      </div>
                   </div>
                   
                   <div className="bg-[#F4F1EA]/50 p-3 flex items-center gap-3 text-[10px] text-[#6B6060] rounded-sm">
                      <ShieldCheck size={16} className="text-[#C5A059]" />
                      <p>Secure Checkout • 7-Day Returns • Silk Mark Certified</p>
                   </div>

                   <button 
                      onClick={handleCheckout}
                      className="w-full bg-[#2D2424] text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#701a1a] transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg"
                   >
                      Proceed to Checkout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
             )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};