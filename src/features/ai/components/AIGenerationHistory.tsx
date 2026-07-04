import React from 'react';
import { History, Clock, ChevronRight } from 'lucide-react';

export const AIGenerationHistory: React.FC = () => {
  const historyItems = [
    { id: 'h1', title: 'React 19 Custom Hook Architecture', time: '10 mins ago' },
    { id: 'h2', title: 'Express Zod Middleware Validation', time: '1 hour ago' },
    { id: 'h3', title: 'Paystack Webhook Verification Node.js', time: 'Yesterday' },
  ];

  return (
    <div className="glass-card p-3 rounded-4">
      <div className="d-flex align-items-center gap-2 mb-3 text-secondary small fw-bold text-uppercase">
        <History size={16} className="text-purple" /> Generation History
      </div>
      <div className="d-flex flex-column gap-2">
        {historyItems.map((item) => (
          <button
            key={item.id}
            className="btn btn-dark border border-secondary text-start p-2.5 rounded-3 d-flex align-items-center justify-content-between hover-border-purple"
          >
            <div>
              <div className="fw-semibold small text-light text-truncate" style={{ maxWidth: '180px' }}>
                {item.title}
              </div>
              <div className="text-secondary opacity-75 d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                <Clock size={11} /> {item.time}
              </div>
            </div>
            <ChevronRight size={16} className="text-secondary" />
          </button>
        ))}
      </div>
    </div>
  );
};
