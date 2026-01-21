import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { CartModal } from '@/components/shop/CartModal';
import { useCart } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';

export const Layout = () => {
  const { cartOpen, setCartOpen } = useCart();
  const location = useLocation();

  // Scroll to top on route change (Backup for ScrollToTop component)
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    // FIX: Hardcoded hex to ensure background is never transparent
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      {/* 1. Navbar loads ONCE here */}
      <Navbar />
      
      {/* 2. Page Content changes here */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* 3. Footer & Global Modals */}
      <Footer />
      
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
      
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#2D2424', 
            color: '#fff', 
            fontSize: '12px',
            borderRadius: '2px', 
            padding: '12px 24px',
            textTransform: 'uppercase', 
            letterSpacing: '1px',
            border: '1px solid #C5A059'
          },
          success: { iconTheme: { primary: '#C5A059', secondary: '#fff' } }
        }}
      />
    </div>
  );
};