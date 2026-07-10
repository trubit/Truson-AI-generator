import React from 'react';
import { Link } from 'react-router-dom';
import { useAIStore } from '../../store/ai.store';
import { useAuthStore } from '../../store/auth.store';
import { Cpu, Sparkles, User, ShieldCheck } from 'lucide-react';
import { AIProviderId } from '@shared';

export const Navbar: React.FC = () => {
  const { activeProvider, switchProvider } = useAIStore();
  const { user } = useAuthStore();

  return (
    <nav className="navbar navbar-expand-lg border-bottom border-secondary bg-dark px-4 py-3 sticky-top">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center text-decoration-none">
          <div
            className="d-flex align-items-center justify-content-center me-2 rounded-3 p-2"
            style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}
          >
            <Sparkles size={22} color="#ffffff" />
          </div>
          <span className="fs-4 fw-bold gradient-text" style={{ fontFamily: 'Outfit' }}>
            Neurova
          </span>
        </Link>

        <div className="d-flex align-items-center gap-3 ms-auto">
          {/* AI Provider Switcher Pill */}
          <div className="d-flex align-items-center bg-body-tertiary px-3 py-1.5 rounded-pill border border-secondary">
            <Cpu size={16} className="text-purple me-2" />
            <span className="text-secondary me-2 small">AI Engine:</span>
            <select
              className="form-select form-select-sm bg-transparent border-0 text-light fw-semibold p-0 pe-4"
              value={activeProvider}
              onChange={(e) => switchProvider(e.target.value as AIProviderId)}
              style={{ cursor: 'pointer', outline: 'none' }}
              id="ai-provider-select"
            >
              <option value="openai" className="bg-dark text-light">OpenAI (GPT-4o)</option>
              <option value="claude" className="bg-dark text-light">Claude 3.5 Sonnet</option>
              <option value="gemini" className="bg-dark text-light">Google Gemini 1.5</option>
            </select>
          </div>

          {/* User Profile Badge */}
          <div className="d-flex align-items-center gap-2 border-start border-secondary ps-3 ms-2">
            <div className="rounded-circle bg-secondary p-2 d-flex align-items-center justify-content-center">
              <User size={18} className="text-light" />
            </div>
            <div className="d-none d-md-block text-start">
              <div className="fw-semibold small">{user ? `${user.firstName} ${user.lastName}` : 'Guest User'}</div>
              <div className="text-secondary small d-flex align-items-center gap-1">
                <ShieldCheck size={12} className="text-success" /> Enterprise Plan
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
