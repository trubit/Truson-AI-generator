import React from 'react';
import { Outlet } from 'react-router-dom';

export const EmptyLayout: React.FC = () => {
  return (
    <div className="min-vh-100 bg-dark text-light">
      <Outlet />
    </div>
  );
};
