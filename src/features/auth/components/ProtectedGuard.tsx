import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth.store';
import { FullscreenLoader } from '../../../components/loading/FullscreenLoader';

export const ProtectedGuard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <FullscreenLoader message="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
