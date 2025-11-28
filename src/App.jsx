import React, { createContext, useState, Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { LocationProvider } from './hooks/useLocation';
import { CartProvider } from './context/CartContext'; // Changed to relative
import { LoginModalProvider } from './context/LoginModalContext'; // Changed to relative
import { AnimatePresence, motion } from 'framer-motion';
import { CartModal } from './components/shop/CartModal'; // Changed to relative
import { WhatsAppButton } from './components/common/WhatsAppButton'; // Changed to relative
import { LoginPromptModal } from './components/LoginPromptModal'; // Changed to relative
import ScrollToTop from './components/utils/ScrollToTop'; // Changed to relative
import { AppSkeleton } from './components/skeletons/AppSkeleton'; // Changed to relative
import { ProtectedRoute } from './components/ProtectedRoute'; // Changed to relative
import { AnalyticsTracker } from './components/utils/AnalyticsTracker'; // Changed to relative

// --- LAZY LOAD PAGES (Speed Optimization) ---
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ReturnPolicy = lazy(() => import('./pages/ReturnPolicy'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1, transition: { duration: 0.3 } },
  out: { opacity: 0, transition: { duration: 0.2 } }
};

// Helper for Animations
const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    className="w-full min-h-screen"
  >
    {children}
  </motion.div>
);

export default function App() {
  const [theme, setTheme] = useState('light');
  const location = useLocation();
  const toggleTheme = () => setTheme('light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthProvider>
        <LocationProvider>
          <LoginModalProvider>
            <CartProvider>
              
              <ScrollToTop />
              <AnalyticsTracker />
              
              <div className="min-h-screen bg-white text-brand-dark font-sans overflow-x-hidden w-full relative">
                
                {/* SUSPENSE WRAPPER: Shows Skeleton while the page chunk loads */}
                <Suspense fallback={<AppSkeleton />}>
                  <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                      
                      {/* PUBLIC ROUTES */}
                      <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
                      <Route path="/shop" element={<PageWrapper><ShopPage /></PageWrapper>} />
                      <Route path="/product/:productId" element={<PageWrapper><ProductDetailsPage /></PageWrapper>} />
                      <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
                      <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
                      <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
                      
                      {/* LEGAL */}
                      <Route path="/returns" element={<PageWrapper><ReturnPolicy /></PageWrapper>} />
                      <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
                      <Route path="/terms" element={<PageWrapper><TermsPage /></PageWrapper>} />

                      {/* PROTECTED ROUTES (User) */}
                      <Route path="/favorites" element={
                        <ProtectedRoute><PageWrapper><FavoritesPage /></PageWrapper></ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute><PageWrapper><ProfilePage /></PageWrapper></ProtectedRoute>
                      } />
                      <Route path="/checkout" element={
                        <ProtectedRoute><PageWrapper><CheckoutPage /></PageWrapper></ProtectedRoute>
                      } />
                      <Route path="/order-success/:orderId" element={
                        <ProtectedRoute><PageWrapper><OrderSuccessPage /></PageWrapper></ProtectedRoute>
                      } />

                      {/* PROTECTED ROUTES (Admin) */}
                      <Route path="/admin/*" element={
                        <ProtectedRoute adminOnly={true}><PageWrapper><AdminPage /></PageWrapper></ProtectedRoute>
                      } />

                      {/* 404 */}
                      <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
                      
                    </Routes>
                  </AnimatePresence>
                </Suspense>

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