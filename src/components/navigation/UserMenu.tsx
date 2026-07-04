import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { User, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { Link } from 'react-router-dom';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="dark"
        id="dropdown-user-menu"
        className="d-flex align-items-center gap-2 border-0 bg-transparent p-1"
      >
        <div className="rounded-circle bg-purple p-2 d-flex align-items-center justify-content-center text-white">
          <User size={18} />
        </div>
        <div className="d-none d-md-block text-start">
          <div className="fw-semibold small text-light">{user?.name || 'Architect User'}</div>
          <div className="text-secondary small d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
            <ShieldCheck size={12} className="text-success" /> Enterprise
          </div>
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu-dark border-secondary shadow-lg">
        <Dropdown.Header>{user?.email}</Dropdown.Header>
        <Dropdown.Item as={Link} to="/settings" className="d-flex align-items-center gap-2">
          <Settings size={16} /> Platform Settings
        </Dropdown.Item>
        <Dropdown.Divider className="border-secondary" />
        <Dropdown.Item onClick={logout} className="d-flex align-items-center gap-2 text-danger">
          <LogOut size={16} /> Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
