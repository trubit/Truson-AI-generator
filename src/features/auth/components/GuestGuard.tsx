import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth.store';
import { FullscreenLoader } from '../../../components/loading/FullscreenLoader';

export const GuestGuard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <FullscreenLoader message="Checking authentication session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
