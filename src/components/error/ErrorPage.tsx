import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';

export const ErrorPage: React.FC<{ code?: number; message?: string }> = ({
  code = 500,
  message = 'Internal Application Error',
}) => {
  return (
    <div className="min-vh-100 bg-dark text-light d-flex flex-column align-items-center justify-content-center text-center p-4">
      <div className="p-4 rounded-circle bg-purple bg-opacity-20 text-purple mb-3">
        <ShieldAlert size={48} />
      </div>
      <h1 className="display-3 fw-bold gradient-text mb-2">{code}</h1>
      <h3 className="fw-semibold mb-3">{message}</h3>
      <p className="text-secondary mb-4">The application encountered an unexpected state.</p>
      <Link to="/">
        <Button variant="glow">Return to Dashboard</Button>
      </Link>
    </div>
  );
};
