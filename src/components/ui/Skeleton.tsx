import React from 'react';
import MuiSkeleton from '@mui/material/Skeleton';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rounded',
  width,
  height,
  className = '',
}) => {
  return (
    <MuiSkeleton
      variant={variant}
      width={width}
      height={height}
      animation="wave"
      className={className}
      sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)' }}
    />
  );
};
