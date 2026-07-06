import React, { useState } from 'react';
import { Copy, Download, Check, Code, FileText, ChevronDown } from 'lucide-react';
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
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Output copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = (format: 'txt' | 'md' | 'pdf' | 'docx') => {
    setShowExportMenu(false);
    
    let mimeType = 'text/plain;charset=utf-8';
    let fileExtension = format;
    let finalContent = content;

    switch (format) {
      case 'md':
        mimeType = 'text/markdown;charset=utf-8';
        finalContent = `# Generated AI Solution\n\nGenerated using model: ${model}\nDate: ${new Date().toLocaleDateString()}\n\n---\n\n${content}`;
        break;
      case 'pdf':
        // Future proof PDF builder mock wrapper (downloads plain file with PDF instructions inside)
        mimeType = 'application/pdf;charset=utf-8';
        finalContent = `%PDF-1.4\n%-- Truson-AI Generated Document PDF Structure --\n\n${content}`;
        fileExtension = 'pdf';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        finalContent = `[DOCX-COMPATIBLE]\nTitle: Truson-AI Generated Output\n\n${content}`;
        fileExtension = 'docx';
        break;
    }

    const blob = new Blob([finalContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-export-${Date.now()}.${fileExtension}`;
    link.click();
    toast.success(`Exported successfully as ${format.toUpperCase()}!`);
  };

  return (
    <div className="glass-card p-4 rounded-4 h-100 d-flex flex-column position-relative">
      <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-secondary">
        <div className="d-flex align-items-center gap-2">
          <Code className="text-cyan" size={20} />
          <span className="fw-bold fs-6">Generated AI Output</span>
          <span className="badge bg-dark text-secondary border border-secondary ms-2">{model.toUpperCase()}</span>
        </div>
        <div className="d-flex gap-2 position-relative">
          <Button variant="outline" size="sm" onClick={handleCopy} leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
          
          <div className="position-relative">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              rightIcon={<ChevronDown size={14} />}
            >
              Export
            </Button>
            
            {showExportMenu && (
              <div
                className="position-absolute end-0 mt-1 bg-dark border border-secondary rounded-3 p-1 shadow-lg"
                style={{ zIndex: 100, minWidth: '130px' }}
              >
                <button
                  type="button"
                  className="btn btn-sm btn-dark text-start w-100 px-3 py-2 text-light hover-text-white d-flex align-items-center gap-2"
                  onClick={() => handleExport('txt')}
                >
                  <FileText size={13} /> Plain Text (.txt)
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-dark text-start w-100 px-3 py-2 text-light hover-text-white d-flex align-items-center gap-2"
                  onClick={() => handleExport('md')}
                >
                  <FileText size={13} /> Markdown (.md)
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-dark text-start w-100 px-3 py-2 text-light hover-text-white d-flex align-items-center gap-2"
                  onClick={() => handleExport('pdf')}
                >
                  <FileText size={13} /> PDF Structure (.pdf)
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-dark text-start w-100 px-3 py-2 text-light hover-text-white d-flex align-items-center gap-2"
                  onClick={() => handleExport('docx')}
                >
                  <FileText size={13} /> Word DOCX (.docx)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-grow-1 p-3 bg-dark border border-secondary rounded-3 text-mono text-light overflow-auto small">
        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{content}</pre>
      </div>
    </div>
  );
};
