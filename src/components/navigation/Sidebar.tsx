import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Code2, FileText, Settings, Cpu, Bot, Compass, Sparkles } from 'lucide-react';
import { useLayoutStore } from '../../store/layout-store';

export const Sidebar: React.FC = () => {
  const { isSidebarCollapsed } = useLayoutStore();

  const navItems = [
    { label: 'Landing Overview', icon: Compass, to: '/landing' },
    { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
    { label: 'AI Chat Workspace', icon: Bot, to: '/ai-workspace' },
    { label: 'Coding & Dev Prompts', icon: Code2, to: '/prompts' },
    { label: 'Writing Studio', icon: FileText, to: '/content' },
    { label: 'AI Architecture', icon: Cpu, to: '/ai-engine' },
    { label: 'Platform Settings', icon: Settings, to: '/settings' },
  ];

  return (
    <aside
      className="bg-dark border-end border-secondary p-3 d-none d-lg-flex flex-column transition-all"
      style={{ width: isSidebarCollapsed ? '80px' : '260px', minHeight: 'calc(100vh - 73px)' }}
    >
      <div className="text-uppercase text-secondary fs-8 fw-bold tracking-wider mb-3 px-3">
        {!isSidebarCollapsed && 'Navigation'}
      </div>
      <ul className="nav nav-pills flex-column mb-auto gap-1">
        {navItems.map((item) => (
          <li key={item.to} className="nav-item">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 transition-all ${
                  isActive ? 'active-nav-link text-white fw-semibold' : 'text-secondary hover-text-white'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' : 'transparent',
              })}
            >
              <item.icon size={19} />
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      {!isSidebarCollapsed && (
        <div className="glass-card p-3 mt-auto rounded-3 border-purple">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <div className="d-flex align-items-center gap-1.5 text-purple fw-bold small">
              <Sparkles size={15} /> Neurova Pro
            </div>
            <span className="badge bg-purple-subtle text-purple border border-purple" style={{ fontSize: '0.65rem' }}>
              Active
            </span>
          </div>
          <p className="text-secondary small mb-0" style={{ fontSize: '0.78rem' }}>
            Unlimited AI Prompts & Generation Workspaces.
          </p>
        </div>
      )}
    </aside>
  );
};
