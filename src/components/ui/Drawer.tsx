import React from 'react';
import { Offcanvas } from 'react-bootstrap';

export interface DrawerProps {
  show: boolean;
  onHide: () => void;
  title: string;
  placement?: 'start' | 'end' | 'top' | 'bottom';
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  show,
  onHide,
  title,
  placement = 'end',
  children,
}) => {
  return (
    <Offcanvas show={show} onHide={onHide} placement={placement} data-bs-theme="dark">
      <Offcanvas.Header closeButton className="border-bottom border-secondary bg-dark text-light">
        <Offcanvas.Title className="fw-bold fs-5">{title}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="bg-dark text-light">{children}</Offcanvas.Body>
    </Offcanvas>
  );
};
