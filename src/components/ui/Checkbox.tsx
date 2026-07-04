import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', id, ...props }) => {
  const checkId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="form-check mb-2">
      <input
        type="checkbox"
        id={checkId}
        className={`form-check-input bg-dark border-secondary ${className}`}
        {...props}
      />
      <label htmlFor={checkId} className="form-check-label text-light small">
        {label}
      </label>
    </div>
  );
};
