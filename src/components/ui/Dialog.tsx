import React from 'react';
import { Modal } from 'react-bootstrap';

export interface DialogProps {
  show: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'lg' | 'xl';
}

export const Dialog: React.FC<DialogProps> = ({
  show,
  onHide,
  title,
  children,
  footer,
  size = 'lg',
}) => {
  return (
    <Modal show={show} onHide={onHide} size={size} centered data-bs-theme="dark">
      <Modal.Header closeButton className="border-secondary bg-dark text-light">
        <Modal.Title className="fw-bold fs-5">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">{children}</Modal.Body>
      {footer && <Modal.Footer className="border-secondary bg-dark text-light">{footer}</Modal.Footer>}
    </Modal>
  );
};
