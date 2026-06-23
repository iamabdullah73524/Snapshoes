import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function ProtectedRoute({ children }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to={`/login?redirect=${location.pathname.replace(/^\//, '')}`} replace />;
  }

  return children;
}

export function AdminRoute({ children }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    return <Navigate to={`/login?redirect=${location.pathname.replace(/^\//, '')}`} replace />;
  }

  return children;
}
