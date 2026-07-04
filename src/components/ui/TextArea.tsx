import React from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, className = '', id, ...props }) => {
  const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={areaId} className="form-label text-secondary small fw-semibold">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        className={`form-control bg-dark border-secondary text-light ${
          error ? 'is-invalid' : ''
        } ${className}`}
        {...props}
      />
      {error && <div className="invalid-feedback d-block small mt-1">{error}</div>}
    </div>
  );
};
