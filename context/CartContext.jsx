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

  // --- HELPER: GENERATE CONSISTENT OPTION KEY ---
  const getOptionsKey = (options) => {
    if (!options || typeof options !== 'object') return "{}";

    // 1. Filter out false, null, or undefined values
    //    (This ensures {fall: false} matches {})
    // 2. Sort keys alphabetically
    //    (This ensures {a:1, b:2} matches {b:2, a:1})
    const validOptions = Object.keys(options)
      .filter(key => options[key]) // Only keep truthy values (true, string, numbers > 0)
      .sort()
      .reduce((obj, key) => {
        obj[key] = options[key];
        return obj;
      }, {});

    return JSON.stringify(validOptions);
  };

  // --- 1. ADD TO CART (Fixed Duplication Logic) ---
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Generate a standardized key for the incoming product's options
      const productOptionsKey = getOptionsKey(product.selectedOptions);
      
      const existingItemIndex = prevCart.findIndex(
        (item) => 
          String(item.id) === String(product.id) && // Match ID
          getOptionsKey(item.selectedOptions) === productOptionsKey // Match Options
      );

      if (existingItemIndex > -1) {
        // EXACT SAME ITEM EXISTS -> Increment Quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += (product.quantity || 1);
        
        // Optional: Update price if the new one is different (rare case)
        // newCart[existingItemIndex].price = product.price; 
        
        return newCart;
      } else {
        // NEW ITEM -> Add with unique internal ID
        return [...prevCart, { 
            ...product, 
            quantity: product.quantity || 1,
            // Ensure we store the options, defaulting to empty obj
            selectedOptions: product.selectedOptions || {},
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

  // --- 3. UPDATE QUANTITY ---
  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart((prevCart) => 
      prevCart.map((item) => 
        // Match by _cartId if available, fallback to id
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