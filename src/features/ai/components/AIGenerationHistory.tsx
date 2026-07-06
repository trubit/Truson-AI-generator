import React, { useEffect } from 'react';
import { History, Clock, ChevronRight } from 'lucide-react';
import { useHistoryStore } from '../../../store/history-store';

interface AIGenerationHistoryProps {
  onSelectHistoryText?: (text: string) => void;
}

export const AIGenerationHistory: React.FC<AIGenerationHistoryProps> = ({ onSelectHistoryText }) => {
  const { aiHistory, fetchAIHistory, isLoading } = useHistoryStore();

  useEffect(() => {
    fetchAIHistory();
  }, [fetchAIHistory]);

  const getRelativeTime = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="glass-card p-3 rounded-4">
      <div className="d-flex align-items-center gap-2 mb-3 text-secondary small fw-bold text-uppercase">
        <History size={16} className="text-purple" /> Generation History
      </div>
      
      {isLoading && aiHistory.length === 0 ? (
        <div className="text-center py-3 text-secondary small">Loading history...</div>
      ) : aiHistory.length === 0 ? (
        <div className="text-center py-3 text-secondary small">No generations logged yet.</div>
      ) : (
        <div className="d-flex flex-column gap-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {aiHistory.slice(0, 10).map((item) => (
            <button
              key={item._id}
              type="button"
              className="btn btn-dark border border-secondary text-start p-2.5 rounded-3 d-flex align-items-center justify-content-between hover-border-purple"
              onClick={() => onSelectHistoryText?.(item.response?.text || '')}
            >
              <div className="w-100 overflow-hidden">
                <div className="fw-semibold small text-light text-truncate" style={{ maxWidth: '90%' }}>
                  {item.category}: {item.request?.prompt}
                </div>
                <div className="text-secondary opacity-75 d-flex align-items-center gap-1 mt-1" style={{ fontSize: '0.72rem' }}>
                  <Clock size={11} /> {getRelativeTime(item.createdAt)}
                  <span className="badge bg-purple-subtle text-purple border border-purple px-1 py-0.5" style={{ fontSize: '0.6rem' }}>
                    {item.provider?.toUpperCase()}
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-secondary flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
