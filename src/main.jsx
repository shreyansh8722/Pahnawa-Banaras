import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@/index.css';

// Layout & Pages
const LazyApp = lazy(() => import('@/App'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const ShopPage = lazy(() => import('@/pages/ShopPage'));
const ProductDetailsPage = lazy(() => import('@/pages/ProductDetailsPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage')); 
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

// --- NEW ADMIN PAGE ---
const AdminPage = lazy(() => import('@/pages/AdminPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <LazyApp />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/shop', element: <ShopPage /> },
      { path: '/product/:productId', element: <ProductDetailsPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/order-success', element: <OrderSuccessPage /> },
      { path: '/favorites', element: <FavoritesPage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/profile', element: <ProfilePage /> },
      
      // --- ADMIN ROUTE ---
      { path: '/admin', element: <AdminPage /> },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<div className="h-screen w-full bg-white flex items-center justify-center text-[#B08D55]">Loading Pahnawa...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
);