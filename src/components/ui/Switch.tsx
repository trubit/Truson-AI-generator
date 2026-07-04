import React from 'react';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Switch: React.FC<SwitchProps> = ({ label, className = '', id, ...props }) => {
  const switchId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="form-check form-switch mb-2">
      <input
        type="checkbox"
        role="switch"
        id={switchId}
        className={`form-check-input ${className}`}
        {...props}
      />
      <label htmlFor={switchId} className="form-check-label text-light small fw-medium">
        {label}
      </label>
    </div>
  );
};
