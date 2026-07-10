import React, { useState } from 'react';
import { useConversationStore } from '../../../store/conversation-store';
import { useMessageStore } from '../../../store/message-store';
import { useChatStore } from '../../../store/chat-store';
import { Download, Cpu, Clock, BarChart3, HelpCircle, FileText } from 'lucide-react';
import { apiClient } from '../../../api/client';
import toast from 'react-hot-toast';

export const ChatRightSidebar: React.FC = () => {
  const { activeConversationId, conversations } = useConversationStore();
  const { messages } = useMessageStore();
  const { isRightSidebarOpen } = useChatStore();

  const [isExporting, setIsExporting] = useState(false);
  const activeConv = conversations.find((c) => c._id === activeConversationId);

  if (!isRightSidebarOpen || !activeConv) return null;

  // Calculate cumulative stats
  const totalTokens = messages.reduce((acc, curr) => acc + (curr.tokenUsage?.totalTokens || 0), 0);
  const avgLatency = messages.length > 0
    ? Math.round(messages.reduce((acc, curr) => acc + (curr.processingTime || 0), 0) / messages.length)
    : 0;

  const handleExport = async (format: 'md' | 'txt' | 'pdf' | 'docx') => {
    if (!activeConversationId) return;

    try {
      setIsExporting(true);
      const response = await apiClient.post(
        `/chat/conversations/${activeConversationId}/export`,
        { format },
        { responseType: 'blob' }
      );

      // Trigger download
      const blob = new Blob([response.data], { type: (response.headers['content-type'] as string) || undefined });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from disposition headers or format fallback
      const contentDisposition = response.headers['content-disposition'];
      let filename = `conversation-export.${format}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) filename = match[1];
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Chat history successfully exported as ${format.toUpperCase()}`);
    } catch (_error: any) {
      toast.error('Failed to export conversation log.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="d-flex flex-column h-100 border-start border-secondary bg-dark bg-opacity-70 p-3" style={{ width: '280px' }}>
      <h6 className="fw-bold mb-3 text-secondary text-uppercase tracking-wider small" style={{ fontFamily: 'Outfit' }}>
        Chat Workspace Info
      </h6>

      {/* Stats Card */}
      <div className="glass-card p-3 rounded-3 mb-4">
        <div className="d-flex align-items-center gap-2 mb-3 text-cyan fw-bold small">
          <BarChart3 size={15} /> Thread Analytics
        </div>

        <div className="d-flex flex-column gap-3">
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-secondary small d-flex align-items-center gap-1">
              <Cpu size={12} /> Total Token Usage
            </span>
            <span className="badge bg-purple-subtle text-purple border border-purple">
              {totalTokens.toLocaleString()}
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <span className="text-secondary small d-flex align-items-center gap-1">
              <Clock size={12} /> Avg Latency
            </span>
            <span className="text-light fw-bold small">
              {avgLatency} ms
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <span className="text-secondary small d-flex align-items-center gap-1">
              <HelpCircle size={12} /> Messages count
            </span>
            <span className="text-light fw-bold small">
              {messages.length}
            </span>
          </div>
        </div>
      </div>

      {/* Model Spec */}
      <div className="glass-card p-3 rounded-3 mb-4">
        <div className="d-flex align-items-center gap-2 mb-2 text-cyan fw-bold small">
          <Cpu size={15} /> Active Engine Provider
        </div>
        <p className="text-secondary small mb-1">
          Model: <span className="text-light fw-bold text-uppercase">{activeConv.provider}</span>
        </p>
        <p className="text-secondary small mb-0" style={{ fontSize: '0.72rem' }}>
          Configured priorities and fallback options apply automatically if rate limits occur.
        </p>
      </div>

      {/* Export Options */}
      <div className="mt-auto">
        <h6 className="fw-bold mb-2.5 text-secondary text-uppercase tracking-wider small" style={{ fontSize: '0.7rem' }}>
          Export History Log
        </h6>
        
        <div className="d-flex flex-column gap-2">
          <button
            type="button"
            className="w-100 text-start d-flex align-items-center gap-2 justify-content-between export-card-button px-3 py-2.5 text-light small"
            onClick={() => handleExport('md')}
            disabled={isExporting}
          >
            <span className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
              <FileText size={13} className="text-purple" /> Markdown Document
            </span>
            <Download size={12} className="text-secondary" />
          </button>

          <button
            type="button"
            className="w-100 text-start d-flex align-items-center gap-2 justify-content-between export-card-button px-3 py-2.5 text-light small"
            onClick={() => handleExport('txt')}
            disabled={isExporting}
          >
            <span className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
              <FileText size={13} className="text-cyan" /> Plain Text Document
            </span>
            <Download size={12} className="text-secondary" />
          </button>

          <button
            type="button"
            className="w-100 text-start d-flex align-items-center gap-2 justify-content-between export-card-button px-3 py-2.5 text-light small"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
          >
            <span className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
              <FileText size={13} className="text-danger" /> PDF Structure
            </span>
            <Download size={12} className="text-secondary" />
          </button>

          <button
            type="button"
            className="w-100 text-start d-flex align-items-center gap-2 justify-content-between export-card-button px-3 py-2.5 text-light small"
            onClick={() => handleExport('docx')}
            disabled={isExporting}
          >
            <span className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
              <FileText size={13} className="text-primary" /> Word DOCX Structure
            </span>
            <Download size={12} className="text-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
};
