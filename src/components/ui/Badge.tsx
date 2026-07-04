import React from 'react';

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'cyan';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'purple', children, className = '' }) => {
  const getBadgeClass = () => {
    switch (variant) {
      case 'success':
        return 'bg-success-subtle text-success border-success';
      case 'warning':
        return 'bg-warning-subtle text-warning border-warning';
      case 'danger':
        return 'bg-danger-subtle text-danger border-danger';
      case 'cyan':
        return 'bg-cyan-subtle text-cyan border-cyan';
      case 'secondary':
        return 'bg-secondary-subtle text-secondary border-secondary';
      default:
        return 'bg-purple-subtle text-purple border-purple';
    }
  };

  return (
    <span
      className={`badge border px-2.5 py-1 rounded-pill fw-semibold small ${getBadgeClass()} ${className}`}
    >
      {children}
    </span>
  );
};
