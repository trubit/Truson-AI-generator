import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = true,
  hoverEffect = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`${glass ? 'glass-card' : 'bg-body-tertiary border border-secondary'} ${
        hoverEffect ? 'hover-border-purple' : ''
      } p-4 rounded-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
