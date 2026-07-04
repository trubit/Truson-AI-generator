import React, { useState } from 'react';
import { Copy, Download, Check, Code, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui';
import toast from 'react-hot-toast';

export interface AIOutputPanelProps {
  content?: string;
  model?: string;
}

export const AIOutputPanel: React.FC<AIOutputPanelProps> = ({
  content = '// AI Engine Output Stream Placeholder\n// Execute prompt to stream output code or text...',
  model = 'gpt-4o',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Output copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-output-${Date.now()}.txt`;
    link.click();
    toast.success('Output file downloaded!');
  };

  return (
    <div className="glass-card p-4 rounded-4 h-100 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-secondary">
        <div className="d-flex align-items-center gap-2">
          <Code className="text-cyan" size={20} />
          <span className="fw-bold fs-6">Generated AI Output</span>
          <span className="badge bg-dark text-secondary border border-secondary ms-2">{model}</span>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExport} leftIcon={<Download size={14} />}>
            Export
          </Button>
        </div>
      </div>

      <div className="flex-grow-1 p-3 bg-dark border border-secondary rounded-3 text-mono text-light overflow-auto small">
        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{content}</pre>
      </div>
    </div>
  );
};
