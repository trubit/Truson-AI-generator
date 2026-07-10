import React from 'react';
import { 
  Settings, Download, History, RotateCcw, 
  ChevronRight, Sparkles, Clock, FileText, Calendar 
} from 'lucide-react';
import { useContentStore } from '../store/content-store';
import { useVersions, useRestoreVersion } from '../hooks/useContent';
import { apiClient } from '../../../api/client';
import toast from 'react-hot-toast';

export const RightSettingsPanel: React.FC = () => {
  const { activeDocument, isRightSidebarOpen, toggleRightSidebar, setActiveDocument } = useContentStore();
  
  const { data: versionsRes } = useVersions(activeDocument?._id || null);
  const restoreMutation = useRestoreVersion();

  const versions = versionsRes?.data || [];

  if (!isRightSidebarOpen) {
    return (
      <button 
        onClick={toggleRightSidebar}
        className="btn bg-dark-medium border-start border-secondary text-secondary p-2 d-flex flex-column align-items-center justify-content-center h-100 border-0"
        style={{ width: '40px' }}
      >
        <ChevronRight size={18} />
        <span className="text-uppercase small mt-3 fw-bold tracking-wider writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
          Details
        </span>
      </button>
    );
  }

  const handleExport = async (format: 'md' | 'txt' | 'pdf' | 'docx') => {
    if (!activeDocument?._id) return;
    
    const loadingToast = toast.loading(`Preparing ${format.toUpperCase()} download...`);
    try {
      const response = await apiClient.get(`/content/${activeDocument._id}/export?format=${format}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] as string });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeDocument.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`Exported as ${format.toUpperCase()}`, { id: loadingToast });
    } catch (err: any) {
      toast.error('Failed to export content', { id: loadingToast });
    }
  };

  const handleRestore = (versionNumber: number) => {
    if (!activeDocument?._id) return;

    restoreMutation.mutate({
      id: activeDocument._id,
      versionNumber
    }, {
      onSuccess: (res) => {
        setActiveDocument(res.data);
        toast.success(`Restored to version ${versionNumber}`);
      },
      onError: (err: any) => {
        toast.error(err.message || 'Failed to restore version');
      }
    });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="d-flex flex-column h-100 border-start border-secondary bg-dark-medium" style={{ width: '300px', minWidth: '300px' }}>
      
      {/* Header */}
      <div className="p-3 border-bottom border-secondary d-flex align-items-center justify-content-between">
        <h6 className="mb-0 fw-bold text-white d-flex align-items-center gap-2">
          <Settings size={16} className="text-secondary" /> Settings & Export
        </h6>
        <button 
          onClick={toggleRightSidebar}
          className="btn btn-sm btn-icon p-1 text-secondary hover-text-light border-0"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex-grow-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
        
        {/* Export Options */}
        <div className="mb-4">
          <div className="text-secondary fw-semibold small mb-2 text-uppercase tracking-wider">Export Document</div>
          <div className="row g-2">
            <div className="col-6">
              <button 
                onClick={() => handleExport('pdf')}
                className="btn btn-outline-secondary w-100 py-2.5 rounded-3 d-flex flex-column align-items-center gap-1.5 border-secondary text-light small hover-bg"
              >
                <Download size={16} className="text-cyan-dim" />
                <span>PDF Document</span>
              </button>
            </div>
            <div className="col-6">
              <button 
                onClick={() => handleExport('docx')}
                className="btn btn-outline-secondary w-100 py-2.5 rounded-3 d-flex flex-column align-items-center gap-1.5 border-secondary text-light small hover-bg"
              >
                <Download size={16} className="text-cyan-dim" />
                <span>Word Document</span>
              </button>
            </div>
            <div className="col-6">
              <button 
                onClick={() => handleExport('md')}
                className="btn btn-outline-secondary w-100 py-2.5 rounded-3 d-flex flex-column align-items-center gap-1.5 border-secondary text-light small hover-bg"
              >
                <Download size={16} className="text-cyan-dim" />
                <span>Markdown</span>
              </button>
            </div>
            <div className="col-6">
              <button 
                onClick={() => handleExport('txt')}
                className="btn btn-outline-secondary w-100 py-2.5 rounded-3 d-flex flex-column align-items-center gap-1.5 border-secondary text-light small hover-bg"
              >
                <Download size={16} className="text-cyan-dim" />
                <span>Plain Text</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Engine Info */}
        <div className="mb-4 p-3 bg-dark-deep border border-secondary rounded-4">
          <div className="text-secondary fw-semibold small mb-2 text-uppercase tracking-wider">Generation Metadata</div>
          <div className="space-y-2 text-sm text-secondary-dim">
            <div className="d-flex justify-content-between">
              <span>Category:</span>
              <span className="text-white fw-medium">{activeDocument?.category}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Type:</span>
              <span className="text-white fw-medium">{activeDocument?.contentType}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Provider:</span>
              <span className="text-white fw-medium capitalize d-flex align-items-center gap-1">
                <Sparkles size={12} className="text-cyan" /> {activeDocument?.aiProvider}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Status:</span>
              <span className={`badge ${
                activeDocument?.status === 'published' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
              }`}>
                {activeDocument?.status}
              </span>
            </div>
          </div>
        </div>

        {/* Version History */}
        <div>
          <div className="text-secondary fw-semibold small mb-2 text-uppercase tracking-wider d-flex align-items-center gap-2">
            <History size={14} /> Version History
          </div>
          <div className="space-y-2">
            {versions.map((ver) => (
              <div key={ver._id} className="p-2 bg-dark rounded-3 border border-secondary d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-light small fw-medium">Version #{ver.versionNumber}</div>
                  <div className="text-secondary small d-flex align-items-center gap-1">
                    <Calendar size={12} /> {formatDate(ver.createdAt)}
                  </div>
                </div>
                <button
                  onClick={() => handleRestore(ver.versionNumber)}
                  disabled={restoreMutation.isPending}
                  className="btn btn-outline-cyan btn-xs px-2 py-1 rounded-2 border-cyan text-cyan hover-scale"
                  title="Restore Version"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            ))}
            {versions.length === 0 && (
              <div className="text-secondary text-center small py-3 italic">
                No older versions found. History is created on editing updates.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
