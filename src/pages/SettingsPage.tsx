import React from 'react';
import { Settings, Shield, Bell, Lock, Cpu, Server } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="container-fluid px-0">
      <div className="mb-4">
        <h2 className="fw-bold d-flex align-items-center gap-2">
          <Settings className="text-purple" /> Platform Settings
        </h2>
        <p className="text-secondary">
          Configure security policies, performance optimizations, and system preferences.
        </p>
      </div>

      <div className="row g-4">
        {/* Security & Compliance Card */}
        <div className="col-md-6">
          <div className="glass-card p-4 rounded-4 h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Shield className="text-success" size={20} /> Security & Compliance
            </h5>

            <div className="mb-3 d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold small">Strict Rate Limiting</div>
                <div className="text-secondary small">Limit IP requests to 300 / 15 mins</div>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold small">Helmet HTTP Security Headers</div>
                <div className="text-secondary small">Protect against XSS and clickjacking</div>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold small">Secure Cookie Session Tokens</div>
                <div className="text-secondary small">HttpOnly, SameSite & SSL enforced</div>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </div>
          </div>
        </div>

        {/* Engine Preferences Card */}
        <div className="col-md-6">
          <div className="glass-card p-4 rounded-4 h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Cpu className="text-purple" size={20} /> AI Engine Preferences
            </h5>

            <div className="mb-3">
              <label className="form-label text-secondary small fw-semibold">Default Temperature Override</label>
              <select className="form-select bg-dark border-secondary text-light">
                <option value="0.2">0.2 — Precise & Deterministic (Recommended for Code)</option>
                <option value="0.7">0.7 — Balanced (Recommended for General Prompts)</option>
                <option value="1.0">1.0 — Creative & Varied</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary small fw-semibold">Fallback Provider Policy</label>
              <select className="form-select bg-dark border-secondary text-light">
                <option value="auto">Auto-switch to secondary provider on API rate limit</option>
                <option value="strict">Strict mode (Fail fast without fallback)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
