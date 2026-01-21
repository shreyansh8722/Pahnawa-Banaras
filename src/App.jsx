import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './context/CartContext';
import { LoginModalProvider } from './context/LoginModalContext';
import { ProductProvider } from './context/ProductContext';
import { AppSkeleton } from './components/skeletons/AppSkeleton';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToTop } from './components/utils/ScrollToTop';
import { AnalyticsTracker } from './components/utils/AnalyticsTracker';
import { HelmetProvider } from 'react-helmet-async';

// --- LAYOUT ---
import { Layout } from './components/layout/Layout'; // Make sure this path is correct

// --- COMPONENTS ---
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { NewsletterPopup } from './components/common/NewsletterPopup';

// --- LAZY LOAD PAGES ---
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ReturnPolicy = lazy(() => import('./pages/ReturnPolicy'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AnalyticsTracker />
        <ScrollToTop />
        
        <AuthProvider>
          <LoginModalProvider>
            <CartProvider>
              <ProductProvider>
                <Suspense fallback={<AppSkeleton />}>
                  
                  {/* Global Popups */}
                  <NewsletterPopup />
                  <WhatsAppButton />

                  <Routes>
                    {/* --- MAIN LAYOUT ROUTES --- */}
                    {/* All pages inside here will automatically get the Navbar and Footer */}
                    <Route element={<Layout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      
                      {/* FIX: Ensure param matches the one used in ProductDetailsPage (productId vs id) */}
                      <Route path="/product/:id" element={<ProductDetailsPage />} />
                      <Route path="/product/:productId" element={<ProductDetailsPage />} /> 
                      
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/track-order" element={<TrackOrderPage />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/returns" element={<ReturnPolicy />} />
                      <Route path="/terms" element={<TermsPage />} />
                      
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order-success" element={<OrderSuccessPage />} />
                      
                      {/* Protected Routes */}
                      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                      <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                    </Route>

                    {/* --- STANDALONE ROUTES --- */}
                    {/* Login usually looks better without the main navbar */}
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* Admin usually has its own layout, but keeping here for now */}
                    <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>} />
                    
                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>

                </Suspense>
              </ProductProvider>
            </CartProvider>
          </LoginModalProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;