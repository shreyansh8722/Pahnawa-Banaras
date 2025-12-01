import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  // Load from localStorage initially
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // --- 1. ADD TO CART (With Unique ID Generation) ---
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Create a unique key based on ID + Options to find duplicates
      const optionsKey = JSON.stringify(product.selectedOptions || {});
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && JSON.stringify(item.selectedOptions || {}) === optionsKey
      );

      if (existingItemIndex > -1) {
        // Item exists with same options -> Increment Quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += (product.quantity || 1);
        return newCart;
      } else {
        // New Item -> Add unique internal ID (_cartId) for reliable updates
        return [...prevCart, { 
            ...product, 
            quantity: product.quantity || 1,
            _cartId: Date.now() + Math.random().toString(36).substr(2, 9) 
        }];
      }
    });
    setIsCartOpen(true); // Open cart when item added
  };

  // --- 2. REMOVE FROM CART ---
  const removeFromCart = (cartId) => {
    setCart((prevCart) => prevCart.filter((item) => (item._cartId || item.id) !== cartId));
  };

  // --- 3. UPDATE QUANTITY (Fixed Logic) ---
  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart((prevCart) => 
      prevCart.map((item) => 
        // Match by _cartId if available, fallback to id (for old items)
        (item._cartId === cartId || (!item._cartId && item.id === cartId))
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const clearCart = () => setCart([]);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Calculate Totals
  const cartTotal = cart.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      openCart,
      closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
};