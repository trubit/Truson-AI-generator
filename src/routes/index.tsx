import React from 'react';
import { Routes } from 'react-router-dom';
import { PublicRoutes } from './public-routes';
import { ProtectedRoutes } from './protected-routes';
import { WorkspaceRoutes } from './workspace-routes';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {PublicRoutes}
      {WorkspaceRoutes}
      {ProtectedRoutes}
    </Routes>
  );
};
