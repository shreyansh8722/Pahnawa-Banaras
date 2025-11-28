import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './context/CartContext';
import { LoginModalProvider } from './context/LoginModalContext'; // NEW IMPORT
import { AppSkeleton } from './components/skeletons/AppSkeleton';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToTop } from './components/utils/ScrollToTop';
import { AnalyticsTracker } from './components/utils/AnalyticsTracker';
import { HelmetProvider } from 'react-helmet-async';

// Lazy Load Pages for Performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CartPage = lazy(() => import('./pages/CheckoutPage')); // Renamed route but kept file same
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

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AnalyticsTracker />
        <ScrollToTop />
        <AuthProvider>
          <LoginModalProvider> {/* WRAPPED HERE */}
            <CartProvider>
              <Suspense fallback={<AppSkeleton />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:productId" element={<ProductDetailsPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  
                  {/* Legal Pages */}
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/returns" element={<ReturnPolicy />} />
                  <Route path="/terms" element={<TermsPage />} />

                  {/* Protected User Routes */}
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/order-success" element={
                    <ProtectedRoute>
                      <OrderSuccessPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/favorites" element={
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  } />

                  {/* Admin Route */}
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminPage />
                    </ProtectedRoute>
                  } />

                  {/* 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </CartProvider>
          </LoginModalProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;