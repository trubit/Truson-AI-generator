import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={selectId} className="form-label text-secondary small fw-semibold">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`form-select bg-dark border-secondary text-light ${
          error ? 'is-invalid' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-dark text-light">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback d-block small mt-1">{error}</div>}
    </div>
  );
};
