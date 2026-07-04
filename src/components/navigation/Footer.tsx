import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="footer bg-dark border-top border-secondary py-4 px-4 text-secondary small">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <span className="fw-bold gradient-text">Truson-AI-Generator</span> — Enterprise AI Platform Foundation.
          </div>
          <div className="col-md-6 text-md-end d-flex gap-3 justify-content-md-end">
            <Link to="/landing" className="text-secondary hover-text-white text-decoration-none">
              Overview
            </Link>
            <Link to="/prompts" className="text-secondary hover-text-white text-decoration-none">
              Prompts
            </Link>
            <Link to="/settings" className="text-secondary hover-text-white text-decoration-none">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
