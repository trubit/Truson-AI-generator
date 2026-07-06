import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth.store';
import { UserRole } from '@shared';
import { FullscreenLoader } from '../../../components/loading/FullscreenLoader';

export const RoleGuard: React.FC<{ allowedRoles: UserRole[] }> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <FullscreenLoader message="Checking permissions..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
