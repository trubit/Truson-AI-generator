import React, { useState } from 'react';
import { Send, Sparkles, Paperclip } from 'lucide-react';
import { Button } from '../../../components/ui';

export interface AIPromptInputProps {
  onSend?: (prompt: string) => void;
  isLoading?: boolean;
}

export const AIPromptInput: React.FC<AIPromptInputProps> = ({ onSend, isLoading = false }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (onSend) onSend(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-3 rounded-4 border-purple">
      <textarea
        className="form-control bg-transparent border-0 text-light resize-none mb-2 shadow-none"
        rows={3}
        placeholder="Ask the AI Engine or specify a software architecture requirement..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary">
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-sm text-secondary hover-text-white border-0">
            <Paperclip size={18} />
          </button>
        </div>
        <Button variant="glow" size="sm" type="submit" isLoading={isLoading} rightIcon={<Send size={16} />}>
          Send Prompt
        </Button>
      </div>
    </form>
  );
};
