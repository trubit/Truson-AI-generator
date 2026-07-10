import React, { useState, useEffect, useRef } from 'react';
import { 
  Undo, Redo, Copy, Save, Sparkles, BookOpen, 
  Eye, EyeOff, Star, Tag, Folder, ArrowRight, Loader2, Check 
} from 'lucide-react';
import { useContentStore } from '../store/content-store';
import { useCollections, useCreateDocument, useUpdateDocument, useGenerateContent, useTemplates } from '../hooks/useContent';
import { parseMarkdown } from '../utils/markdown';
import toast from 'react-hot-toast';
import { apiClient } from '../../../api/client';

export const MainEditor: React.FC = () => {
  const { 
    activeDocument, 
    selectedTemplateId, 
    saveStatus,
    undoStack,
    redoStack,
    setActiveDocument, 
    setSaveStatus,
    pushToUndo,
    undo,
    redo,
    setSelectedTemplateId
  } = useContentStore();

  const { data: collectionsRes } = useCollections();
  const { data: templatesRes } = useTemplates();
  const createDocMutation = useCreateDocument();
  const updateDocMutation = useUpdateDocument();
  const generateMutation = useGenerateContent();

  const collections = collectionsRes?.data || [];
  const templates = templatesRes?.data || [];

  // Local editor states for debouncing
  const [localTitle, setLocalTitle] = useState('');
  const [localContent, setLocalContent] = useState('');
  const [editorTab, setEditorTab] = useState<'edit' | 'preview' | 'split'>('split');
  const [newTag, setNewTag] = useState('');

  // Inline AI Assistant states
  const [assistantAction, setAssistantAction] = useState('improve');
  const [assistantInstructions, setAssistantInstructions] = useState('');
  const [isAssistantRunning, setIsAssistantRunning] = useState(false);

  // Template form variables state
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [selectedProvider, setSelectedProvider] = useState('openai');

  // Ref to skip undo recording on load/undo/redo triggers
  const skipNextUndoRef = useRef(false);

  // Setup template form default variables on template change
  const activeTemplate = templates.find(t => t.id === selectedTemplateId);
  useEffect(() => {
    if (activeTemplate) {
      const defaults: Record<string, string> = {};
      activeTemplate.fields.forEach((f: any) => {
        defaults[f.name] = f.default || '';
      });
      setTemplateVariables(defaults);
    }
  }, [selectedTemplateId, activeTemplate]);

  // Load document values into local state when activeDocument changes
  useEffect(() => {
    if (activeDocument) {
      setLocalTitle(activeDocument.title);
      setLocalContent(activeDocument.generatedContent);
      skipNextUndoRef.current = true;
    } else {
      setLocalTitle('');
      setLocalContent('');
    }
  }, [activeDocument?._id]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!activeDocument?._id) return;
    
    // Only save if values changed from the database values
    if (localTitle === activeDocument.title && localContent === activeDocument.generatedContent) {
      return;
    }

    setSaveStatus('saving');

    const timer = setTimeout(() => {
      updateDocMutation.mutate(
        {
          id: activeDocument._id!,
          data: {
            title: localTitle,
            generatedContent: localContent,
          },
        },
        {
          onSuccess: (res) => {
            setSaveStatus('saved');
            // Keep in sync with store
            if (activeDocument) {
              activeDocument.title = localTitle;
              activeDocument.generatedContent = localContent;
            }
          },
          onError: () => {
            setSaveStatus('error');
            toast.error('Failed to auto-save document changes');
          }
        }
      );
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timer);
  }, [localTitle, localContent]);

  // Record undo states on content change
  useEffect(() => {
    if (!activeDocument?._id) return;
    if (skipNextUndoRef.current) {
      skipNextUndoRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      pushToUndo(localContent);
    }, 500);
    return () => clearTimeout(timer);
  }, [localContent]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
  };

  // Undo / Redo Actions
  const handleUndo = () => {
    const prev = undo(localContent);
    if (prev !== null) {
      skipNextUndoRef.current = true;
      setLocalContent(prev);
    }
  };

  const handleRedo = () => {
    const next = redo(localContent);
    if (next !== null) {
      skipNextUndoRef.current = true;
      setLocalContent(next);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(localContent);
    toast.success('Content copied to clipboard');
  };

  // Move to collection handler
  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!activeDocument?._id) return;
    const collectionId = e.target.value || undefined;
    
    updateDocMutation.mutate({
      id: activeDocument._id,
      data: { collectionId: (collectionId || null) as any },
    }, {
      onSuccess: (res) => {
        setActiveDocument(res.data);
        toast.success(collectionId ? 'Added to collection' : 'Removed from collection');
      }
    });
  };

  // Toggle favorite status
  const handleFavoriteToggle = () => {
    if (!activeDocument?._id) return;
    updateDocMutation.mutate({
      id: activeDocument._id,
      data: { isFavorite: !activeDocument.isFavorite },
    }, {
      onSuccess: (res) => {
        setActiveDocument(res.data);
        toast.success(res.data.isFavorite ? 'Added to favorites' : 'Removed from favorites');
      }
    });
  };

  // Tags management
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDocument?._id || !newTag.trim()) return;
    const currentTags = activeDocument.tags || [];
    if (currentTags.includes(newTag.trim())) {
      setNewTag('');
      return;
    }
    const updatedTags = [...currentTags, newTag.trim()];

    updateDocMutation.mutate({
      id: activeDocument._id,
      data: { tags: updatedTags },
    }, {
      onSuccess: (res) => {
        setActiveDocument(res.data);
        setNewTag('');
        toast.success('Tag added');
      }
    });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!activeDocument?._id) return;
    const updatedTags = (activeDocument.tags || []).filter(t => t !== tagToRemove);

    updateDocMutation.mutate({
      id: activeDocument._id,
      data: { tags: updatedTags },
    }, {
      onSuccess: (res) => {
        setActiveDocument(res.data);
        toast.success('Tag removed');
      }
    });
  };

  // Template AI Content Generation
  const handleGenerateFromTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTemplate) return;

    generateMutation.mutate({
      templateId: activeTemplate.id,
      providerId: selectedProvider,
      variables: templateVariables
    }, {
      onSuccess: (res) => {
        // Create a new document with generated content
        createDocMutation.mutate({
          title: `Generated ${activeTemplate.name}`,
          category: res.data.category,
          contentType: res.data.contentType,
          editorMode: 'markdown',
          generatedContent: res.data.text,
          aiProvider: selectedProvider,
          status: 'draft',
          tags: [activeTemplate.contentType.toLowerCase()]
        }, {
          onSuccess: (newDocRes) => {
            setActiveDocument(newDocRes.data);
            setSelectedTemplateId(null); // Clear template form view
            toast.success('Document generated successfully!');
          }
        });
      },
      onError: (err: any) => {
        toast.error(err.message || 'Generation failed');
      }
    });
  };

  // Inline AI Assistant Command Execution
  const handleInlineAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDocument?._id || !localContent.trim()) return;

    setIsAssistantRunning(true);
    try {
      const res = await apiClient.post('/ai/assistant', {
        action: assistantAction,
        text: localContent,
        instructions: assistantInstructions,
        providerId: selectedProvider
      });

      if (res.data?.success && res.data?.data?.text) {
        setLocalContent(res.data.data.text);
        setAssistantInstructions('');
        toast.success('Text refined by AI');
      }
    } catch (err: any) {
      toast.error(err.message || 'AI assistant request failed');
    } finally {
      setIsAssistantRunning(false);
    }
  };

  // Render Template Input Fields Form
  if (selectedTemplateId && activeTemplate && !activeDocument) {
    return (
      <div className="flex-grow-1 overflow-y-auto p-4 bg-dark-deep text-light scrollbar-thin">
        <div className="max-w-3xl mx-auto glass-card p-5 rounded-4 border border-secondary shadow-lg">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-secondary">
            <div>
              <h3 className="fw-bold text-white d-flex align-items-center gap-2 mb-1">
                <Sparkles className="text-cyan animate-pulse" /> {activeTemplate.name}
              </h3>
              <p className="text-secondary mb-0">{activeTemplate.description}</p>
            </div>
            <button 
              onClick={() => setSelectedTemplateId(null)}
              className="btn btn-outline-secondary btn-sm rounded-3 border-secondary"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleGenerateFromTemplate} className="space-y-4">
            {/* AI Provider Config */}
            <div className="mb-4">
              <label className="form-label text-secondary fw-semibold small">Select AI Model Provider</label>
              <select 
                value={selectedProvider} 
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="form-select bg-dark border-secondary text-white rounded-3 focus-cyan"
              >
                <option value="openai">OpenAI (GPT-4o)</option>
                <option value="gemini">Google Gemini (Pro)</option>
                <option value="claude">Anthropic Claude (Sonnet)</option>
              </select>
            </div>

            {/* Template Fields */}
            {activeTemplate.fields.map((field: any) => (
              <div key={field.name} className="mb-4">
                <label className="form-label text-secondary fw-semibold small">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    value={templateVariables[field.name] || ''}
                    onChange={(e) => setTemplateVariables({ ...templateVariables, [field.name]: e.target.value })}
                    className="form-control bg-dark border-secondary text-white rounded-3 focus-cyan"
                    required
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={templateVariables[field.name] || ''}
                    onChange={(e) => setTemplateVariables({ ...templateVariables, [field.name]: e.target.value })}
                    className="form-select bg-dark border-secondary text-white rounded-3 focus-cyan"
                    required
                  >
                    {field.options?.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={templateVariables[field.name] || ''}
                    onChange={(e) => setTemplateVariables({ ...templateVariables, [field.name]: e.target.value })}
                    className="form-control bg-dark border-secondary text-white rounded-3 focus-cyan"
                    required
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={generateMutation.isPending || createDocMutation.isPending}
              className="btn btn-cyan w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-bold text-dark hover-scale transition-all"
            >
              {generateMutation.isPending || createDocMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Generating Document Content...
                </>
              ) : (
                <>
                  Generate Content <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Placeholder when no document is active
  if (!activeDocument) {
    return (
      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center bg-dark-deep p-5 text-center text-secondary">
        <BookOpen size={64} className="text-secondary mb-4 opacity-40" />
        <h4 className="fw-bold text-light mb-2">No Document Selected</h4>
        <p className="max-w-md mx-auto mb-4 small text-secondary-dim">
          Create a blank document, choose a template from the library on the left, or open a saved draft from the documents tab.
        </p>
        <button 
          onClick={() => setActiveDocument({
            title: 'Untitled Document',
            category: 'General',
            contentType: 'Draft',
            editorMode: 'markdown',
            generatedContent: '',
            status: 'draft',
            tags: []
          })}
          className="btn btn-outline-cyan rounded-3 px-4 py-2 border-cyan hover-scale text-cyan"
        >
          Create Blank Document
        </button>
      </div>
    );
  }

  // Calculate statistics
  const wordCount = localContent ? localContent.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = localContent ? localContent.length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 225));

  return (
    <div className="flex-grow-1 d-flex flex-column h-100 bg-dark-deep text-light">
      
      {/* Editor Header Toolbar */}
      <div className="px-4 py-3 border-bottom border-secondary bg-dark-medium d-flex align-items-center justify-content-between flex-wrap gap-3">
        
        {/* Title & Save status */}
        <div className="d-flex align-items-center gap-3 flex-grow-1 max-w-lg">
          <input
            type="text"
            value={localTitle}
            onChange={handleTitleChange}
            placeholder="Untitled Document..."
            className="form-control bg-transparent border-0 px-0 fs-5 fw-bold text-white focus-none"
            style={{ minWidth: '200px' }}
          />
          <div className="small text-secondary-dim border-start border-secondary ps-3 d-flex align-items-center gap-1.5 min-w-[80px]">
            {saveStatus === 'saving' && (
              <>
                <Loader2 size={12} className="animate-spin text-cyan" />
                <span>Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <Check size={12} className="text-success" />
                <span className="text-success-dim">Saved</span>
              </>
            )}
          </div>
        </div>

        {/* Toolbar Buttons */}
        <div className="d-flex align-items-center gap-2">
          {/* Collection Move Select */}
          <div className="d-flex align-items-center gap-2 bg-dark px-2.5 py-1.5 rounded-3 border border-secondary">
            <Folder size={14} className="text-secondary" />
            <select
              value={activeDocument.collectionId || ''}
              onChange={handleCollectionChange}
              className="bg-transparent border-0 text-white small focus-none pr-3 cursor-pointer"
            >
              <option value="">No Collection</option>
              {collections.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Favorite Star */}
          <button 
            onClick={handleFavoriteToggle}
            className={`btn p-2 rounded-3 border-0 hover-bg ${
              activeDocument.isFavorite ? 'text-warning' : 'text-secondary hover-text-warning'
            }`}
            title={activeDocument.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
          >
            <Star size={18} fill={activeDocument.isFavorite ? 'currentColor' : 'none'} />
          </button>

          {/* Undo/Redo/Copy */}
          <div className="border-start border-secondary ps-2 d-flex align-items-center gap-1">
            <button 
              onClick={handleUndo} 
              disabled={undoStack.length === 0}
              className="btn btn-icon p-2 text-secondary hover-text-light border-0"
              title="Undo"
            >
              <Undo size={16} />
            </button>
            <button 
              onClick={handleRedo} 
              disabled={redoStack.length === 0}
              className="btn btn-icon p-2 text-secondary hover-text-light border-0"
              title="Redo"
            >
              <Redo size={16} />
            </button>
            <button 
              onClick={handleCopy} 
              className="btn btn-icon p-2 text-secondary hover-text-light border-0"
              title="Copy"
            >
              <Copy size={16} />
            </button>
          </div>

          {/* View Tab selectors */}
          <div className="btn-group bg-dark border border-secondary p-0.5 rounded-3">
            <button 
              onClick={() => setEditorTab('edit')}
              className={`btn btn-sm px-2.5 py-1.5 border-0 rounded-2.5 ${editorTab === 'edit' ? 'bg-secondary text-white' : 'text-secondary'}`}
            >
              <EyeOff size={14} className="me-1.5" /> Write
            </button>
            <button 
              onClick={() => setEditorTab('preview')}
              className={`btn btn-sm px-2.5 py-1.5 border-0 rounded-2.5 ${editorTab === 'preview' ? 'bg-secondary text-white' : 'text-secondary'}`}
            >
              <Eye size={14} className="me-1.5" /> Preview
            </button>
            <button 
              onClick={() => setEditorTab('split')}
              className={`btn btn-sm px-2.5 py-1.5 border-0 rounded-2.5 ${editorTab === 'split' ? 'bg-secondary text-white' : 'text-secondary'}`}
            >
              Split
            </button>
          </div>
        </div>

      </div>

      {/* Editor Body Area */}
      <div className="flex-grow-1 d-flex overflow-hidden">
        
        {/* Write Editor Area */}
        {(editorTab === 'edit' || editorTab === 'split') && (
          <div className="flex-grow-1 h-100 p-3 d-flex flex-column">
            <textarea
              value={localContent}
              onChange={handleTextChange}
              placeholder="Start writing here (Supports Markdown formatting)..."
              className="form-control flex-grow-1 bg-transparent border-0 resize-none text-white focus-none p-3 fs-6 lh-lg scrollbar-thin"
              style={{ fontFamily: 'var(--font-monospace, monospace)' }}
            />
          </div>
        )}

        {/* Live Preview Area */}
        {(editorTab === 'preview' || editorTab === 'split') && (
          <div className={`flex-grow-1 h-100 p-4 overflow-y-auto bg-dark-deep scrollbar-thin border-start border-secondary ${
            editorTab === 'split' ? 'w-50' : 'w-100'
          }`}>
            <div 
              className="markdown-body text-light"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(localContent) }}
            />
            {!localContent && (
              <div className="text-secondary text-center py-5 small italic">Live preview will show up here.</div>
            )}
          </div>
        )}

      </div>

      {/* Inline AI Assistant & Statistics Footer */}
      <div className="px-4 py-3 border-top border-secondary bg-dark-medium d-flex align-items-center justify-content-between flex-wrap gap-3">
        {/* Inline AI Assistant Form */}
        <form onSubmit={handleInlineAssistant} className="d-flex align-items-center gap-2 bg-dark p-1 rounded-3 border border-secondary flex-grow-1 max-w-lg">
          <Sparkles size={16} className="text-cyan ms-2.5" />
          <select
            value={assistantAction}
            onChange={(e) => setAssistantAction(e.target.value)}
            className="bg-transparent border-0 text-white small focus-none pr-2 cursor-pointer"
          >
            <option value="improve">Improve Text</option>
            <option value="rewrite">Rewrite</option>
            <option value="expand">Expand</option>
            <option value="summarize">Summarize</option>
            <option value="correct">Correct Grammar</option>
            <option value="humanize">Humanize</option>
          </select>
          <input
            type="text"
            value={assistantInstructions}
            onChange={(e) => setAssistantInstructions(e.target.value)}
            placeholder="Custom instructions (e.g. make it punchy)..."
            className="form-control form-control-sm bg-transparent border-0 text-white focus-none text-sm px-2 flex-grow-1"
          />
          <button
            type="submit"
            disabled={isAssistantRunning || !localContent}
            className="btn btn-cyan btn-sm py-1.5 px-3 rounded-2.5 text-dark fw-bold hover-scale transition-all d-flex align-items-center gap-1.5"
          >
            {isAssistantRunning ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              'Refine'
            )}
          </button>
        </form>

        {/* Text stats info */}
        <div className="d-flex align-items-center gap-4 text-secondary small">
          <div><strong>{wordCount}</strong> words</div>
          <div><strong>{charCount}</strong> characters</div>
          <div><strong>{readingTime}</strong> min read</div>
        </div>
      </div>

      {/* Tags Tray */}
      <div className="px-4 py-2 border-top border-secondary bg-dark-deep d-flex align-items-center gap-2 flex-wrap">
        <div className="d-flex align-items-center gap-1.5 text-secondary small">
          <Tag size={12} /> Tags:
        </div>
        {(activeDocument.tags || []).map(tag => (
          <span 
            key={tag}
            className="badge bg-secondary-subtle text-secondary border border-secondary px-2 py-1 rounded-2 d-flex align-items-center gap-1.5"
          >
            {tag}
            <button 
              onClick={() => handleRemoveTag(tag)}
              className="btn btn-link p-0 text-secondary hover-text-danger border-0 font-bold leading-none fs-7 line-height-none"
              style={{ paddingBottom: '1px' }}
            >
              &times;
            </button>
          </span>
        ))}
        <form onSubmit={handleAddTag} className="d-flex align-items-center">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="+ Add tag..."
            className="bg-transparent border-0 text-secondary small focus-none py-0 px-2"
            style={{ width: '90px' }}
          />
        </form>
      </div>

    </div>
  );
};
