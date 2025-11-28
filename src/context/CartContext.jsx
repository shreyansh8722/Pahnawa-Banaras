import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLoginModal } from '@/context/LoginModalContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  
  // Load Cart from Local Storage
  const [cart, setCart] = useState(() => {
    try {
      const localCart = localStorage.getItem('pahnawa_cart');
      return localCart ? JSON.parse(localCart) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  
  // Store fetched coupons here
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // 1. Fetch Coupons from Firestore on Mount
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const q = query(collection(db, 'coupons'), where('isActive', '==', true));
        const snap = await getDocs(q);
        const codes = snap.docs.map(doc => doc.data());
        setAvailableCoupons(codes);
      } catch (err) {
        console.error("Failed to load coupons", err);
      }
    };
    fetchCoupons();
  }, []);

  // 2. Persist Cart to Local Storage
  useEffect(() => {
    localStorage.setItem('pahnawa_cart', JSON.stringify(cart));
  }, [cart]);

  // 3. Calculate Totals
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return total + (price * quantity);
    }, 0);
  }, [cart]);

  const cartCount = cart.reduce((count, item) => count + (Number(item.quantity) || 1), 0);

  // 4. Validate Applied Promo when Subtotal Changes
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

  // --- ACTIONS ---

  const addToCart = (product) => {
    if (!user) {
      openLoginModal();
      return;
    }

    if (!product || !product.id) return;

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
            price: price 
        };
        return newCart;
      }
      
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

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setPromoError('');
  };

  const applyPromoCode = async (code) => {
    setPromoError('');
    const upperCode = code.toUpperCase().trim();

    // 1. Check local fetched list first (fastest)
    let coupon = availableCoupons.find(c => c.code === upperCode);

    // 2. If not found locally, check DB directly (in case it was just added)
    if (!coupon) {
      try {
        const q = query(collection(db, 'coupons'), where('code', '==', upperCode), where('isActive', '==', true));
        const snap = await getDocs(q);
        if (!snap.empty) {
          coupon = snap.docs[0].data();
        }
      } catch (err) {
        console.error(err);
      }
    }

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
    availableCoupons, // Exposing fetched coupons to UI
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