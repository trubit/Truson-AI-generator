import React from 'react';
import { Spinner } from '../ui/Spinner';

export const PageLoader: React.FC = () => {
  return (
    <div className="min-vh-50 d-flex flex-column align-items-center justify-content-center">
      <Spinner size="lg" variant="purple" />
      <span className="text-secondary small mt-3 fw-semibold">Loading Page...</span>
    </div>
  );
};
