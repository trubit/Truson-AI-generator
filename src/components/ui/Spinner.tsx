import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'purple' | 'cyan' | 'light';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', variant = 'purple' }) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : size === 'lg' ? 'spinner-lg' : '';
  const colorClass = variant === 'cyan' ? 'text-cyan' : variant === 'light' ? 'text-light' : 'text-purple';

  return (
    <div className={`spinner-border ${sizeClass} ${colorClass}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};
