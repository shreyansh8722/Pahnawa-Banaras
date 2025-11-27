import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

// --- AVAILABLE PROMOS ---
const AVAILABLE_PROMO_CODES = [
  { code: 'WELCOME5', type: 'percent', value: 5, description: '5% off your first order', minOrder: 0 },
  { code: 'SAVE100', type: 'fixed', value: 100, description: 'Flat ₹100 off on orders above ₹2000', minOrder: 2000 },
  { code: 'BANARAS10', type: 'percent', value: 10, description: '10% off festive sale', minOrder: 5000 },
];

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const localCart = localStorage.getItem('pahnawa_cart');
      return localCart ? JSON.parse(localCart) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // --- Promo State ---
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    localStorage.setItem('pahnawa_cart', JSON.stringify(cart));
  }, [cart]);

  // 1. Calculate Subtotal (with safety checks)
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      // Ensure price and quantity are valid numbers, default to 0 if not
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return total + (price * quantity);
    }, 0);
  }, [cart]);

  const cartCount = cart.reduce((count, item) => count + (Number(item.quantity) || 1), 0);

  // 2. Validate Promo & Calculate Discount
  useEffect(() => {
    if (appliedPromo && subtotal < appliedPromo.minOrder) {
      setAppliedPromo(null);
      setPromoError(`Order value must be at least ₹${appliedPromo.minOrder} for this code.`);
    }
  }, [subtotal, appliedPromo]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (subtotal < appliedPromo.minOrder) return 0;

    if (appliedPromo.type === 'fixed') {
      return appliedPromo.value;
    } else {
      return Math.round((subtotal * appliedPromo.value) / 100);
    }
  }, [subtotal, appliedPromo]);

  const cartTotal = Math.max(0, subtotal - discount);

  // --- Actions ---

  const addToCart = (product) => {
    // Validations before adding
    if (!product || !product.id) {
      console.error("Invalid product passed to addToCart:", product);
      return;
    }

    const price = Number(product.price) || 0;
    const quantity = Number(product.quantity) || 1;

    setCart(prev => {
      const optionsKey = product.selectedOptions ? JSON.stringify(product.selectedOptions) : '';
      const uniqueId = `${product.id}-${optionsKey}`;

      const existingIndex = prev.findIndex(p => {
          const pOptionsKey = p.selectedOptions ? JSON.stringify(p.selectedOptions) : '';
          return p.id === product.id && pOptionsKey === optionsKey;
      });

      if (existingIndex > -1) {
        const newCart = [...prev];
        const currentQty = Number(newCart[existingIndex].quantity) || 0;
        newCart[existingIndex] = {
            ...newCart[existingIndex],
            quantity: currentQty + quantity,
            price: price // Update price just in case
        };
        return newCart;
      }
      
      // Add new item with sanitized values
      return [...prev, { 
        ...product, 
        cartItemId: uniqueId,
        price: price,
        quantity: quantity
      }];
    });
    
    setIsCartOpen(true);
    setPromoError('');
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(p => (p.cartItemId || p.id) !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prev => prev.map(p => {
      if ((p.cartItemId || p.id) === cartItemId) {
        const currentQty = Number(p.quantity) || 1;
        return { ...p, quantity: Math.max(1, currentQty + delta) };
      }
      return p;
    }));
  };

  const applyPromoCode = (code) => {
    setPromoError('');
    const coupon = AVAILABLE_PROMO_CODES.find(c => c.code === code.toUpperCase());

    if (!coupon) {
      setPromoError('Invalid coupon code.');
      return false;
    }

    if (subtotal < coupon.minOrder) {
      setPromoError(`Add items worth ₹${coupon.minOrder - subtotal} more to use this code.`);
      return false;
    }

    setAppliedPromo(coupon);
    return true;
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setPromoError('');
  };
  
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const value = {
    cart,
    subtotal,
    discount,
    cartTotal,
    cartCount,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    // Promo Exports
    availableCoupons: AVAILABLE_PROMO_CODES,
    appliedPromo,
    promoError,
    applyPromoCode,
    removePromoCode
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};