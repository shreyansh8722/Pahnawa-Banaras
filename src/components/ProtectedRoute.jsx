import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner'; // Ensure this component exists

const ADMIN_EMAIL = "shreyanshtripathi71@gmail.com";

// CHANGED: export default function -> export function (Named Export)
export function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // 1. Check if Logged In
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check if Admin (Security Layer)
  if (adminOnly && user.email !== ADMIN_EMAIL) {
    // If a normal user tries to access Admin panel, kick them to Home
    return <Navigate to="/" replace />;
  }

  return children;
}