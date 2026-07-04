import React from 'react';
import { Spinner } from '../ui/Spinner';

export const SectionLoader: React.FC = () => {
  return (
    <div className="p-5 d-flex align-items-center justify-content-center">
      <Spinner size="md" variant="cyan" />
    </div>
  );
};
