import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Menu, Moon, Sun, Monitor } from 'lucide-react';
import { useAIStore } from '../../store/ai.store';
import { useThemeStore } from '../../store/theme-store';
import { useUIStore } from '../../store/ui-store';
import { AIProviderId } from '@shared';
import { UserMenu } from './UserMenu';

export const Navbar: React.FC = () => {
  const { activeProvider, switchProvider } = useAIStore();
  const { mode, setMode } = useThemeStore();
  const { toggleMobileMenu } = useUIStore();

  return (
    <nav className="navbar navbar-expand-lg border-bottom border-secondary bg-dark px-4 py-3 sticky-top">
      <div className="container-fluid">
        <button
          className="btn btn-outline-secondary d-lg-none me-3"
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <Link to="/" className="navbar-brand d-flex align-items-center text-decoration-none">
          <img
            src="/logo.png"
            alt="Neurova Logo"
            className="rounded-3 me-2 border border-purple-subtle"
            style={{ width: 38, height: 38, objectFit: 'cover' }}
          />
          <span className="fs-4 fw-bold gradient-text" style={{ fontFamily: 'Outfit' }}>
            Neurova
          </span>
        </Link>

        <div className="d-flex align-items-center gap-3 ms-auto">
          {/* Theme Switcher */}
          <div className="btn-group border border-secondary rounded-pill p-1 bg-body-tertiary">
            <button
              className={`btn btn-sm rounded-circle p-1.5 ${mode === 'dark' ? 'bg-purple text-white' : 'text-secondary'}`}
              onClick={() => setMode('dark')}
              title="Dark Theme"
            >
              <Moon size={15} />
            </button>
            <button
              className={`btn btn-sm rounded-circle p-1.5 ${mode === 'light' ? 'bg-purple text-white' : 'text-secondary'}`}
              onClick={() => setMode('light')}
              title="Light Theme"
            >
              <Sun size={15} />
            </button>
            <button
              className={`btn btn-sm rounded-circle p-1.5 ${mode === 'system' ? 'bg-purple text-white' : 'text-secondary'}`}
              onClick={() => setMode('system')}
              title="System Theme"
            >
              <Monitor size={15} />
            </button>
          </div>

          {/* AI Provider Select */}
          <div className="d-none d-md-flex align-items-center bg-body-tertiary px-3 py-1.5 rounded-pill border border-secondary">
            <span className="text-secondary me-2 small">Engine:</span>
            <select
              className="form-select form-select-sm bg-transparent border-0 text-light fw-semibold p-0 pe-4"
              value={activeProvider}
              onChange={(e) => switchProvider(e.target.value as AIProviderId)}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              <option value="openai" className="bg-dark text-light">OpenAI (GPT-4o)</option>
              <option value="claude" className="bg-dark text-light">Claude 3.5 Sonnet</option>
              <option value="gemini" className="bg-dark text-light">Google Gemini 1.5</option>
            </select>
          </div>

          {/* User Profile Menu */}
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};
