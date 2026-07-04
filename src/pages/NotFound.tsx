import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-50 text-center">
      <h1 className="display-1 fw-bold gradient-text">404</h1>
      <h3 className="fw-semibold mb-3">Page Not Found</h3>
      <p className="text-secondary mb-4">The route you requested does not exist in Phase 1.</p>
      <Link to="/" className="btn glow-btn">
        Return to Dashboard
      </Link>
    </div>
  );
};
