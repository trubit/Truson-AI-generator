import React from 'react';
import { Spinner } from '../ui/Spinner';
import { Sparkles } from 'lucide-react';

export const FullscreenLoader: React.FC<{ message?: string }> = ({ message = 'Initializing Engine...' }) => {
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark text-light d-flex flex-column align-items-center justify-content-center z-3">
      <div className="d-flex align-items-center justify-content-center p-3 rounded-4 bg-purple bg-opacity-20 border border-purple mb-4">
        <Sparkles size={32} className="text-purple animate-pulse" />
      </div>
      <Spinner size="lg" variant="purple" />
      <div className="fw-semibold mt-3 text-light">{message}</div>
    </div>
  );
};
