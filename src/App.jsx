import React, { createContext, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { LocationProvider } from './hooks/useLocation';
import { CartProvider } from '@/context/CartContext'; // IMPORTED HERE
import { LoginModalProvider } from '@/context/LoginModalContext'; // IMPORTED HERE
import { AnimatePresence, motion } from 'framer-motion';
import { CartModal } from '@/components/shop/CartModal';
import ScrollToTop from '@/components/utils/ScrollToTop'; 
import { WhatsAppButton } from '@/components/common/WhatsAppButton'; // Assuming you want the button

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  out: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" } }
};

export default function App() {
  const [theme, setTheme] = useState('light');
  const location = useLocation();
  const toggleTheme = () => setTheme('light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthProvider>
        <LocationProvider>
          {/* 1. Login Provider (Must be inside Auth) */}
          <LoginModalProvider>
            {/* 2. Cart Provider (Must be inside Login & Auth) */}
            <CartProvider>
              
              <ScrollToTop />
              
              <div className="min-h-screen bg-white text-brand-dark font-sans overflow-x-hidden w-full relative">
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    className="w-full min-h-screen"
                    style={{ willChange: "opacity, transform" }}
                  >
                    <Outlet />
                  </motion.div>
                </AnimatePresence>

                {/* Global Overlays */}
                <WhatsAppButton />
                <CartModal />
                
              </div>

            </CartProvider>
          </LoginModalProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeContext.Provider>
  );
}