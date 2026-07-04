import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={inputId} className="form-label text-secondary small fw-semibold">
          {label}
        </label>
      )}
      <div className="position-relative d-flex align-items-center">
        {leftIcon && <span className="position-absolute start-0 ms-3 text-secondary">{leftIcon}</span>}
        <input
          id={inputId}
          className={`form-control bg-dark border-secondary text-light ${
            leftIcon ? 'ps-5' : ''
          } ${error ? 'is-invalid' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <div className="invalid-feedback d-block small mt-1">{error}</div>}
    </div>
  );
};
