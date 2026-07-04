import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'glow':
        return 'glow-btn';
      case 'secondary':
        return 'btn-secondary bg-secondary text-white';
      case 'outline':
        return 'btn-outline-purple border-purple text-purple hover-bg-purple';
      case 'ghost':
        return 'btn-link text-secondary text-decoration-none';
      case 'danger':
        return 'btn-danger bg-danger text-white';
      default:
        return 'btn-primary bg-purple border-0 text-white';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'btn-sm px-3 py-1.5 fs-7';
      case 'lg':
        return 'btn-lg px-4 py-3 fs-5';
      default:
        return 'px-3.5 py-2 fs-6';
    }
  };

  return (
    <button
      className={`btn rounded-3 fw-semibold d-inline-flex align-items-center justify-content-center gap-2 transition-all ${getVariantClass()} ${getSizeClass()} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="spinner-border spinner-border-sm me-1" role="status" />}
      {!isLoading && leftIcon && <span>{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};
