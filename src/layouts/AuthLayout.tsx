import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark p-4 position-relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div
        className="position-absolute rounded-circle opacity-20 pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
          top: '-100px',
          left: '-100px',
        }}
      />
      <div
        className="position-absolute rounded-circle opacity-20 pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
          bottom: '-100px',
          right: '-100px',
        }}
      />

      <div className="w-100 max-w-md">
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-4 bg-purple bg-opacity-20 border border-purple mb-3">
            <Sparkles size={32} className="text-purple" />
          </div>
          <h2 className="fw-bold gradient-text">Truson-AI-Generator</h2>
          <p className="text-secondary small">Next-Gen Enterprise AI Platform</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
