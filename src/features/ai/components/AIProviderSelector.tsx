import React from 'react';
import { Cpu, Check } from 'lucide-react';
import { useAIStore } from '../../../store/ai.store';
import { AIProviderId } from '@shared';

export const AIProviderSelector: React.FC = () => {
  const { activeProvider, switchProvider, providers } = useAIStore();

  return (
    <div className="d-flex align-items-center gap-2 bg-dark p-2 rounded-3 border border-secondary">
      <Cpu size={18} className="text-purple ms-1" />
      <span className="text-secondary small fw-semibold me-1">Provider:</span>
      <div className="btn-group">
        {(['openai', 'claude', 'gemini'] as AIProviderId[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`btn btn-sm ${
              activeProvider === id
                ? 'btn-purple text-white fw-bold'
                : 'btn-outline-secondary text-light'
            }`}
            onClick={() => switchProvider(id)}
          >
            {id === 'openai' && 'OpenAI'}
            {id === 'claude' && 'Claude 3.5'}
            {id === 'gemini' && 'Gemini 1.5'}
          </button>
        ))}
      </div>
    </div>
  );
};
