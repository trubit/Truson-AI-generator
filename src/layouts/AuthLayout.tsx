import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark p-3 position-relative overflow-hidden">
      {/* Dynamic Background Glow Effects */}
      <div
        className="position-absolute rounded-circle opacity-25 pointer-events-none"
        style={{
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
          top: '-120px',
          left: '-120px',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="position-absolute rounded-circle opacity-20 pointer-events-none"
        style={{
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
          bottom: '-120px',
          right: '-120px',
          filter: 'blur(40px)',
        }}
      />

      <div className="w-100" style={{ maxWidth: '390px', zIndex: 2 }}>
        {/* Brand Header */}
        <div className="text-center mb-3">
          <div className="d-inline-flex align-items-center justify-content-center p-2 rounded-4 bg-dark bg-opacity-80 border border-purple-subtle shadow-lg mb-2">
            <img
              src="/logo.png"
              alt="Truson AI Logo"
              style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '10px' }}
            />
          </div>
          <h4 className="fw-bold gradient-text mb-0" style={{ fontFamily: 'Outfit', letterSpacing: '-0.02em' }}>
            Truson-AI
          </h4>
          <p className="text-secondary small mb-0" style={{ fontSize: '0.78rem' }}>
            Enterprise AI Platform
          </p>
        </div>

        {/* Auth Card Outlet */}
        <Outlet />
      </div>
    </div>
  );
};
