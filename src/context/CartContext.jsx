import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

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

  useEffect(() => {
    localStorage.setItem('pahnawa_cart', JSON.stringify(cart));
  }, [cart]);

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const addToCart = (product) => {
    setCart(prev => {
      const optionsKey = product.selectedOptions ? JSON.stringify(product.selectedOptions) : '';
      const uniqueId = `${product.id}-${optionsKey}`;

      const existingIndex = prev.findIndex(p => {
          const pOptionsKey = p.selectedOptions ? JSON.stringify(p.selectedOptions) : '';
          return p.id === product.id && pOptionsKey === optionsKey;
      });

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += product.quantity; // Add specific quantity
        return newCart;
      }
      return [...prev, { ...product, cartItemId: uniqueId }];
    });
    
    // AUTO-OPEN CART
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(p => (p.cartItemId || p.id) !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prev => prev.map(p => {
      if ((p.cartItemId || p.id) === cartItemId) {
        return { ...p, quantity: Math.max(1, p.quantity + delta) };
      }
      return p;
    }));
  };

  const clearCart = () => setCart([]);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const value = {
    cart,
    subtotal,
    cartCount,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};