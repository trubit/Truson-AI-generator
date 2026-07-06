import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="mb-2.5">
      {label && (
        <label htmlFor={inputId} className="form-label text-secondary small fw-semibold mb-1" style={{ fontSize: '0.78rem' }}>
          {label}
        </label>
      )}
      <div className="position-relative d-flex align-items-center">
        {leftIcon && (
          <span className="position-absolute start-0 ms-3 text-secondary d-flex align-items-center pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={`form-control bg-dark border-secondary text-light ${
            leftIcon ? 'ps-5' : ''
          } ${rightIcon ? 'pe-5' : ''} ${error ? 'is-invalid' : ''} ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="position-absolute end-0 me-3 d-flex align-items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <div className="invalid-feedback d-block small mt-1">{error}</div>}
    </div>
  );
};
