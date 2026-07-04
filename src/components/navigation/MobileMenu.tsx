import React from 'react';
import { NavLink } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import { LayoutDashboard, Code2, FileText, Settings, Cpu, Bot, Compass, Sparkles } from 'lucide-react';
import { useUIStore } from '../../store/ui-store';

export const MobileMenu: React.FC = () => {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();

  const navItems = [
    { label: 'Landing Overview', icon: Compass, to: '/landing' },
    { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
    { label: 'AI Chat Workspace', icon: Bot, to: '/ai-workspace' },
    { label: 'Coding & Dev Prompts', icon: Code2, to: '/prompts' },
    { label: 'Content Generator', icon: FileText, to: '/content' },
    { label: 'AI Architecture', icon: Cpu, to: '/ai-engine' },
    { label: 'Platform Settings', icon: Settings, to: '/settings' },
  ];

  return (
    <Offcanvas
      show={isMobileMenuOpen}
      onHide={() => setMobileMenuOpen(false)}
      placement="start"
      data-bs-theme="dark"
    >
      <Offcanvas.Header closeButton className="border-bottom border-secondary bg-dark text-light">
        <Offcanvas.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
          <Sparkles className="text-purple" size={20} /> Navigation
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="bg-dark text-light p-3">
        <ul className="nav nav-pills flex-column gap-1">
          {navItems.map((item) => (
            <li key={item.to} className="nav-item">
              <NavLink
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 ${
                    isActive ? 'bg-purple text-white fw-semibold' : 'text-secondary hover-text-white'
                  }`
                }
              >
                <item.icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </Offcanvas.Body>
    </Offcanvas>
  );
};
