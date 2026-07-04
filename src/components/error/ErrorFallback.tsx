import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-vh-50 d-flex flex-column align-items-center justify-content-center text-center p-4">
      <div className="p-3 rounded-circle bg-danger bg-opacity-20 text-danger mb-3">
        <AlertTriangle size={36} />
      </div>
      <h4 className="fw-bold mb-2">Something went wrong</h4>
      <p className="text-secondary small mb-4 max-w-md">
        {error?.message || 'An unexpected runtime UI error occurred.'}
      </p>
      {resetErrorBoundary && (
        <Button variant="glow" onClick={resetErrorBoundary} leftIcon={<RefreshCw size={16} />}>
          Try Again
        </Button>
      )}
    </div>
  );
};
