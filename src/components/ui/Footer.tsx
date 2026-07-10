import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer bg-dark border-top border-secondary py-3 px-4 text-center text-secondary small">
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div>© 2026 Neurova. Enterprise AI Engine & Architecture Foundation.</div>
        <div className="d-flex gap-3 mt-2 mt-md-0">
          <span className="badge bg-dark-subtle text-secondary border border-secondary">Node.js + Express</span>
          <span className="badge bg-dark-subtle text-secondary border border-secondary">React 19 + Vite</span>
          <span className="badge bg-dark-subtle text-secondary border border-secondary">MongoDB</span>
        </div>
      </div>
    </footer>
  );
};
