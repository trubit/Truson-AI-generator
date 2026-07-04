import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar, MobileMenu, Footer } from '../components/navigation';

export const MainLayout: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      <Navbar />
      <MobileMenu />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4 bg-dark overflow-auto" style={{ maxHeight: 'calc(100vh - 73px)' }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
