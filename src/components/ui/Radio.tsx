import React from 'react';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Radio: React.FC<RadioProps> = ({ label, className = '', id, ...props }) => {
  const radioId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="form-check mb-2">
      <input
        type="radio"
        id={radioId}
        className={`form-check-input bg-dark border-secondary ${className}`}
        {...props}
      />
      <label htmlFor={radioId} className="form-check-label text-light small">
        {label}
      </label>
    </div>
  );
};
