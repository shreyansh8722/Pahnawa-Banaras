import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  // --- STATE ---
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

  // --- INIT ---
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

  // --- CALCULATIONS ---
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
  }, [cart]);

  const cartCount = cart.reduce((count, item) => count + (Number(item.quantity) || 1), 0);

  const discount = useMemo(() => {
    if (!appliedPromo || subtotal < appliedPromo.minOrder) return 0;
    return appliedPromo.type === 'fixed' 
      ? appliedPromo.value 
      : Math.round((subtotal * appliedPromo.value) / 100);
  }, [subtotal, appliedPromo]);

  const cartTotal = Math.max(0, subtotal - discount);

  // --- CORE ACTIONS ---

  const addToCart = (product) => {
    if (!product || !product.id) return;

    // 1. Force ID to string to prevent mismatch (e.g. 123 vs "123")
    const productId = String(product.id);

    // 2. Strict Option Normalization
    // Whether coming from Home (no options) or Product Page (options object),
    // we rebuild it exactly the same way every time.
    const incomingOptions = product.selectedOptions || {};
    const normalizedOptions = {
        fallPico: Boolean(incomingOptions.fallPico),
        blouseStitching: Boolean(incomingOptions.blouseStitching)
    };

    // 3. Generate Deterministic Key
    // JSON.stringify order is usually consistent, but sorting keys makes it 100% safe.
    const optionsString = JSON.stringify(normalizedOptions, Object.keys(normalizedOptions).sort());
    const uniqueCartItemId = `${productId}-${optionsString}`;

    setCart(prev => {
      // Check if this EXACT variation exists
      const existingItemIndex = prev.findIndex(item => item.cartItemId === uniqueCartItemId);

      if (existingItemIndex > -1) {
        // MERGE: Update quantity of existing item
        const newCart = [...prev];
        const existingItem = newCart[existingItemIndex];
        
        newCart[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + (product.quantity || 1),
          // Update price only if options didn't change but base price did (rare edge case)
          price: Number(product.price) || existingItem.price 
        };
        return newCart;
      }

      // ADD: New item
      return [...prev, {
        ...product,
        id: productId, // Ensure ID is string
        selectedOptions: normalizedOptions, // Store the clean options
        cartItemId: uniqueCartItemId, // Store the key
        price: Number(product.price) || 0,
        quantity: Number(product.quantity) || 1
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

  // --- PROMO LOGIC ---
  const applyPromoCode = async (code) => {
    setPromoError('');
    const upperCode = code.toUpperCase().trim();
    
    // Check loaded coupons first
    let coupon = availableCoupons.find(c => c.code === upperCode);

    // If not found, check DB (fallback)
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