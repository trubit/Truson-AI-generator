import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Footer, MobileMenu } from '../components/navigation';

export const LandingLayout: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light overflow-x-hidden">
      <Navbar />
      <MobileMenu />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
