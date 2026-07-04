import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="d-flex flex-column gap-3 p-3">
      <Skeleton variant="rectangular" height={40} className="w-100 rounded-3" />
      <Skeleton variant="rectangular" height={120} className="w-100 rounded-4" />
      <div className="d-flex gap-2">
        <Skeleton variant="rounded" width={100} height={36} />
        <Skeleton variant="rounded" width={100} height={36} />
      </div>
    </div>
  );
};
