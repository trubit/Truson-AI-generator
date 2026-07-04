import React from 'react';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Inbox size={48} className="text-purple opacity-40 mb-3" />,
  title,
  description,
  action,
}) => {
  return (
    <div className="glass-card p-5 rounded-4 text-center d-flex flex-column align-items-center justify-content-center my-4">
      <div>{icon}</div>
      <h5 className="fw-bold mb-2">{title}</h5>
      {description && <p className="text-secondary small mb-4 max-w-md">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
