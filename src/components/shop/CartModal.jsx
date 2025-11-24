import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';

export const CartModal = ({
  open,
  onClose,
  cart,
  onUpdateQuantity,
  onRemove,
  subtotal,
  savings,
  onCheckout,
}) => {
  if (!open) {
    return null;
  }

  return (
    <>
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />
      <div 
        className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-50 flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-serif font-bold text-brand-dark">
            Shopping Bag
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-brand-dark p-1 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- Cart Items --- */}
        {cart.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-400 p-10 text-center">
            <ShoppingBag size={48} className="mb-4 text-gray-300" />
            <p className="font-serif text-lg text-brand-dark mb-2">Your bag is empty</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-6">Start shopping to add items</p>
            <button 
              onClick={onClose}
              className="bg-brand-primary text-white px-8 py-3 uppercase tracking-widest font-bold text-xs hover:bg-brand-dark transition-colors w-full"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex-grow p-6 space-y-4 overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-gray-50 p-3 rounded-sm shadow-sm"
              >
                <img
                  src={
                    item.featuredImageUrl ||
                    item.imageUrls?.[0] ||
                    'https://placehold.co/100x100'
                  }
                  alt={item.name}
                  className="w-16 h-16 object-cover flex-shrink-0"
                />
                <div className="flex-grow">
                  <h4 className="text-sm font-serif font-bold text-brand-dark">
                    {item.name}
                  </h4>
                  <p className="text-sm font-bold text-brand-primary">
                    ₹{(item.price || 0).toFixed(2)}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Control */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold w-6 text-center text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    {/* Remove Button */}
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- Cart Footer --- */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-xl font-serif font-bold text-brand-dark">
                <span>Total</span>
                <span>₹{subtotal}</span>
              </div>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3.5 bg-brand-primary text-white font-bold uppercase tracking-widest text-xs hover:bg-brand-dark transition-all shadow-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};