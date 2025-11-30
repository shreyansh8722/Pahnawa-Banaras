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
  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const q = query(collection(db, 'coupons'), where('isActive', '==', true));
        const snap = await getDocs(q);
        setAvailableCoupons(snap.docs.map(doc => doc.data()));
      } catch (err) {
        console.error("Failed to load coupons", err);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    localStorage.setItem('pahnawa_cart', JSON.stringify(cart));
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
  }, [cart]);

  const cartCount = cart.reduce((count, item) => count + (Number(item.quantity) || 1), 0);

  useEffect(() => {
    if (appliedPromo && subtotal < appliedPromo.minOrder) {
      setAppliedPromo(null);
      setPromoError(`Order value must be at least ₹${appliedPromo.minOrder} for this code.`);
    }
  }, [subtotal, appliedPromo]);

  const discount = useMemo(() => {
    if (!appliedPromo || subtotal < appliedPromo.minOrder) return 0;
    return appliedPromo.type === 'fixed' 
      ? appliedPromo.value 
      : Math.round((subtotal * appliedPromo.value) / 100);
  }, [subtotal, appliedPromo]);

  const cartTotal = Math.max(0, subtotal - discount);

  // --- ACTIONS ---

  const addToCart = (product) => {
    // Allows guest checkout. Uncomment if you want to force login:
    // if (!user) { openLoginModal(); return; }

    if (!product || !product.id) return;

    // 1. Normalize Options: Ensure "undefined" options look the same as "default" options
    // This fixes the duplicate issue between Quick Add and Product Page
    const defaultOptions = { fallPico: false, blouseStitching: false };
    const selectedOptions = product.selectedOptions || defaultOptions;
    
    // Sort keys to ensure object order doesn't affect the JSON string
    const optionsKey = JSON.stringify(
      Object.keys(selectedOptions).sort().reduce((obj, key) => {
        obj[key] = selectedOptions[key];
        return obj;
      }, {})
    );

    const uniqueId = `${product.id}-${optionsKey}`;
    const price = Number(product.price) || 0;
    const quantity = Number(product.quantity) || 1;

    setCart(prev => {
      const existingIndex = prev.findIndex(p => p.cartItemId === uniqueId);

      if (existingIndex > -1) {
        // Item exists: Increment quantity
        const newCart = [...prev];
        newCart[existingIndex] = {
            ...newCart[existingIndex],
            quantity: newCart[existingIndex].quantity + quantity,
            price: price // Update price in case it changed
        };
        return newCart;
      }
      
      // Item new: Add to cart
      return [...prev, { 
        ...product, 
        selectedOptions, // Ensure options are saved
        cartItemId: uniqueId,
        price: price,
        quantity: quantity
      }];
    });
    
    setIsCartOpen(true);
    setPromoError('');
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(p => p.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prev => prev.map(p => {
      if (p.cartItemId === cartItemId) {
        return { ...p, quantity: Math.max(1, p.quantity + delta) };
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
    let coupon = availableCoupons.find(c => c.code === upperCode);

    if (!coupon) {
      try {
        const q = query(collection(db, 'coupons'), where('code', '==', upperCode), where('isActive', '==', true));
        const snap = await getDocs(q);
        if (!snap.empty) coupon = snap.docs[0].data();
      } catch (err) { console.error(err); }
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

  return (
    <CartContext.Provider value={{
      cart, subtotal, discount, cartTotal, cartCount, isCartOpen,
      addToCart, removeFromCart, updateQuantity, clearCart,
      openCart, closeCart, availableCoupons, appliedPromo,
      promoError, applyPromoCode, removePromoCode
    }}>
      {children}
    </CartContext.Provider>
  );
};