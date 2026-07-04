import React from 'react';

export const FormError: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return <div className="invalid-feedback d-block small mt-1">{message}</div>;
};
