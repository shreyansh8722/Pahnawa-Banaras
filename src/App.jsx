import React, { createContext, useState, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { LocationProvider } from './hooks/useLocation';
import { AnimatePresence, motion } from 'framer-motion';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// "Apple-style" smooth easing
const smoothTransition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for premium feel
  duration: 0.3
};

const pageVariants = {
  initial: {
    opacity: 0,
    y: 8, // Slight slide up for premium feel
  },
  in: {
    opacity: 1,
    y: 0,
    transition: smoothTransition
  },
  out: {
    opacity: 0,
    y: -8, // Slight slide down on exit
    transition: { ...smoothTransition, duration: 0.2 } // Faster exit
  }
};

export default function App() {
  const [theme, setTheme] = useState('light');
  const location = useLocation();

  // useLayoutEffect ensures scroll happens BEFORE paint, reducing visual jump
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleTheme = () => { setTheme('light'); };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthProvider>
        <LocationProvider>
          <div className="min-h-screen bg-white text-brand-dark font-sans overflow-x-hidden w-full relative selection:bg-[#B08D55] selection:text-white">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                className="w-full min-h-screen"
                // Hardware acceleration hint to prevent stutter
                style={{ willChange: "opacity, transform" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>

          </div>
        </LocationProvider>
      </AuthProvider>
    </ThemeContext.Provider>
  );
}