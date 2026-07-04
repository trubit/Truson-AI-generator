import React from 'react';
import { AlertCircle, CheckCircle, Info, TriangleAlert } from 'lucide-react';

export interface AlertProps {
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', title, children, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-success me-2" size={20} />;
      case 'warning':
        return <TriangleAlert className="text-warning me-2" size={20} />;
      case 'error':
        return <AlertCircle className="text-danger me-2" size={20} />;
      default:
        return <Info className="text-info me-2" size={20} />;
    }
  };

  const getAlertClass = () => {
    switch (type) {
      case 'success':
        return 'alert-success border-success text-success';
      case 'warning':
        return 'alert-warning border-warning text-warning';
      case 'error':
        return 'alert-danger border-danger text-danger';
      default:
        return 'alert-info border-info text-info';
    }
  };

  return (
    <div className={`alert bg-opacity-10 border rounded-3 p-3 d-flex align-items-start ${getAlertClass()}`}>
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-grow-1">
        {title && <h6 className="alert-heading fw-bold mb-1">{title}</h6>}
        <div className="small">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          className="btn-close ms-2"
          onClick={onClose}
          aria-label="Close"
        />
      )}
    </div>
  );
};
