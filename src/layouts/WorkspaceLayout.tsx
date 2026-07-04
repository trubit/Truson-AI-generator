import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, MobileMenu } from '../components/navigation';

export const WorkspaceLayout: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light overflow-hidden">
      <Navbar />
      <MobileMenu />
      <main className="flex-grow-1 p-0 overflow-hidden d-flex flex-column" style={{ height: 'calc(100vh - 73px)' }}>
        <Outlet />
      </main>
    </div>
  );
};
