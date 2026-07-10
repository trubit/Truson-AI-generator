import React, { useState } from 'react';
import { WritingStudioSidebar } from '../components/WritingStudioSidebar';
import { MainEditor } from '../components/MainEditor';
import { RightSettingsPanel } from '../components/RightSettingsPanel';
import { useContentStore } from '../store/content-store';
import { useCollectionStore } from '../store/collection-store';
import { 
  useDocuments, useDeleteDocument, useCreateDocument, 
  useUpdateDocument, useCreateCollection, useUpdateCollection, useDeleteCollection,
  useCollections
} from '../hooks/useContent';
import { 
  Search, Star, Trash2, Folder, Archive, Copy, 
  Plus, Edit2, Calendar, FileText, ArrowLeft, Loader2, Info
} from 'lucide-react';
import toast from 'react-hot-toast';

export const WritingStudioPage: React.FC = () => {
  const { 
    activeDocument, 
    activeSidebarTab, 
    selectedCollectionId, 
    selectedTemplateId,
    searchQuery,
    setActiveDocument, 
    setSearchQuery,
    setActiveSidebarTab 
  } = useContentStore();

  const { 
    isCreateModalOpen, 
    isEditModalOpen, 
    activeCollection,
    setCreateModalOpen, 
    setEditModalOpen 
  } = useCollectionStore();

  // Queries & Mutations
  const { data: collectionsRes } = useCollections();
  const deleteDocMutation = useDeleteDocument();
  const createDocMutation = useCreateDocument();
  const updateDocMutation = useUpdateDocument();
  
  const createColMutation = useCreateCollection();
  const updateColMutation = useUpdateCollection();
  const deleteColMutation = useDeleteCollection();

  const collections = collectionsRes?.data || [];

  // Documents list parameters
  const params: any = {};
  if (searchQuery) params.search = searchQuery;
  if (activeSidebarTab === 'favorites') params.isFavorite = true;
  if (activeSidebarTab === 'drafts') params.status = 'draft';
  if (activeSidebarTab === 'archived') params.status = 'archived';
  if (activeSidebarTab === 'collections' && selectedCollectionId) {
    params.collectionId = selectedCollectionId;
  }

  const { data: documentsRes, isLoading: docsLoading } = useDocuments(params);
  const documents = documentsRes?.data || [];

  // Modal form states
  const [colName, setColName] = useState('');
  const [colDesc, setColDesc] = useState('');
  const [colVis, setColVis] = useState<'private' | 'public'>('private');

  // Load modal defaults for editing
  React.useEffect(() => {
    if (activeCollection) {
      setColName(activeCollection.name);
      setColDesc(activeCollection.description || '');
      setColVis(activeCollection.visibility);
    } else {
      setColName('');
      setColDesc('');
      setColVis('private');
    }
  }, [activeCollection, isEditModalOpen, isCreateModalOpen]);

  // Document actions
  const handleDeleteDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    deleteDocMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Document deleted');
        if (activeDocument?._id === id) {
          setActiveDocument(null);
        }
      }
    });
  };

  const handleDuplicateDoc = (doc: any, e: React.MouseEvent) => {
    e.stopPropagation();
    createDocMutation.mutate({
      title: `${doc.title} (Copy)`,
      category: doc.category,
      contentType: doc.contentType,
      editorMode: doc.editorMode,
      generatedContent: doc.generatedContent,
      aiProvider: doc.aiProvider,
      status: 'draft',
      tags: [...(doc.tags || [])]
    }, {
      onSuccess: () => {
        toast.success('Document duplicated');
      }
    });
  };

  const handleArchiveToggle = (doc: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = doc.status === 'archived' ? 'draft' : 'archived';
    updateDocMutation.mutate({
      id: doc._id,
      data: { status: newStatus }
    }, {
      onSuccess: () => {
        toast.success(newStatus === 'archived' ? 'Document archived' : 'Document restored');
      }
    });
  };

  // Collection modal handlers
  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName.trim()) return;

    createColMutation.mutate({
      name: colName,
      description: colDesc,
      visibility: colVis
    }, {
      onSuccess: () => {
        toast.success('Collection created');
        setCreateModalOpen(false);
      },
      onError: (err: any) => {
        toast.error(err.message || 'Failed to create collection');
      }
    });
  };

  const handleUpdateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCollection?._id || !colName.trim()) return;

    updateColMutation.mutate({
      id: activeCollection._id,
      data: {
        name: colName,
        description: colDesc,
        visibility: colVis
      }
    }, {
      onSuccess: () => {
        toast.success('Collection updated');
        setEditModalOpen(false, null);
      },
      onError: (err: any) => {
        toast.error(err.message || 'Failed to update collection');
      }
    });
  };

  const handleDeleteCollection = () => {
    if (!activeCollection?._id) return;
    if (!window.confirm('Delete this collection? Documents inside will not be deleted.')) return;

    deleteColMutation.mutate(activeCollection._id, {
      onSuccess: () => {
        toast.success('Collection deleted');
        setEditModalOpen(false, null);
        setActiveSidebarTab('all');
      }
    });
  };

  // Check if we should display list grid instead of editor canvas
  const showListGrid = activeDocument === null && selectedTemplateId === null;

  return (
    <div className="d-flex h-100 bg-dark-deep text-light overflow-hidden">
      {/* Sidebar navigation */}
      <WritingStudioSidebar />

      {/* Main page space */}
      <div className="flex-grow-1 d-flex flex-column h-100 overflow-hidden relative">
        
        {showListGrid ? (
          /* Catalog view */
          <div className="flex-grow-1 overflow-y-auto p-4 scrollbar-thin">
            
            {/* Title Bar & Search */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-4 mb-4">
              <div>
                <h4 className="fw-bold text-white mb-1 capitalize">
                  {activeSidebarTab === 'all' && 'All Documents'}
                  {activeSidebarTab === 'favorites' && 'Favorite Documents'}
                  {activeSidebarTab === 'drafts' && 'Drafts Library'}
                  {activeSidebarTab === 'archived' && 'Archived Documents'}
                  {activeSidebarTab === 'collections' && 'Collection Folder'}
                </h4>
                <p className="text-secondary small mb-0">
                  Manage, organize, search, and refine your AI writing drafts.
                </p>
              </div>

              {/* Search Bar */}
              <div className="d-flex align-items-center gap-2 bg-dark border border-secondary px-3 py-2 rounded-3" style={{ width: '320px' }}>
                <Search size={18} className="text-secondary" />
                <input
                  type="text"
                  placeholder="Search title or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-0 text-white small w-100 focus-none"
                />
              </div>
            </div>

            {/* Collection Metadata Actions */}
            {activeSidebarTab === 'collections' && selectedCollectionId && (
              <div className="glass-card p-3 rounded-4 border border-secondary mb-4 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <Folder className="text-cyan animate-pulse" size={24} />
                  <div>
                    <h6 className="mb-0 fw-semibold text-white">Collection details</h6>
                    <p className="text-secondary small mb-0">Grouped drafts</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const current = collections.find(c => c._id === selectedCollectionId);
                    if (current) setEditModalOpen(true, current);
                  }}
                  className="btn btn-outline-secondary btn-sm border-secondary rounded-3 text-light d-flex align-items-center gap-1.5"
                >
                  <Edit2 size={14} /> Edit Folder
                </button>
              </div>
            )}

            {/* Grid List */}
            {docsLoading ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 text-secondary">
                <Loader2 size={36} className="animate-spin text-cyan mb-2" />
                <span className="small">Fetching documents...</span>
              </div>
            ) : documents.length > 0 ? (
              <div className="row g-4">
                {documents.map((doc: any) => (
                  <div key={doc._id} className="col-md-6 col-lg-4">
                    <div 
                      onClick={() => setActiveDocument(doc)}
                      className="glass-card p-4 rounded-4 border border-secondary h-100 d-flex flex-column justify-content-between cursor-pointer hover-card transition-all"
                    >
                      <div>
                        {/* Title & Star */}
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 className="fw-bold mb-0 text-white text-truncate" style={{ maxWidth: '80%' }}>
                            {doc.title}
                          </h6>
                          {doc.isFavorite && <Star size={16} fill="currentColor" className="text-warning" />}
                        </div>
                        {/* Description/Snippet */}
                        <p className="text-secondary small mb-3 text-line-clamp-3">
                          {doc.generatedContent ? doc.generatedContent.substring(0, 120) + '...' : 'Empty document draft.'}
                        </p>
                      </div>

                      {/* Footer Info */}
                      <div>
                        <div className="d-flex align-items-center justify-content-between border-top border-secondary pt-3 mt-3">
                          <span className="badge bg-secondary-subtle text-secondary small">
                            {doc.contentType}
                          </span>
                          <span className="text-secondary small d-flex align-items-center gap-1">
                            <Calendar size={12} /> {new Date(doc.updatedAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Actions tray */}
                        <div className="d-flex align-items-center justify-content-end gap-2 mt-2 pt-2 border-top border-secondary-dim">
                          <button 
                            onClick={(e) => handleDuplicateDoc(doc, e)}
                            className="btn btn-icon p-1.5 text-secondary hover-text-light border-0"
                            title="Duplicate"
                          >
                            <Copy size={14} />
                          </button>
                          <button 
                            onClick={(e) => handleArchiveToggle(doc, e)}
                            className="btn btn-icon p-1.5 text-secondary hover-text-light border-0"
                            title={doc.status === 'archived' ? 'Restore' : 'Archive'}
                          >
                            <Archive size={14} />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteDoc(doc._id, e)}
                            className="btn btn-icon p-1.5 text-secondary hover-text-danger border-0"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 text-secondary text-center">
                <FileText size={48} className="mb-3 opacity-30" />
                <h6 className="fw-semibold">No Documents Found</h6>
                <p className="small text-secondary-dim max-w-sm">
                  Create a new document or modify search filters to locate documents.
                </p>
              </div>
            )}

          </div>
        ) : (
          /* Editor View */
          <div className="flex-grow-1 d-flex h-100 overflow-hidden">
            {/* Back to library navigation */}
            <div className="absolute top-[16px] left-[16px] z-index-10 d-none">
              <button 
                onClick={() => setActiveDocument(null)}
                className="btn btn-dark-medium border border-secondary text-light rounded-3 px-3 py-1.5 d-flex align-items-center gap-1.5 hover-scale"
              >
                <ArrowLeft size={16} /> Back to Library
              </button>
            </div>
            
            <MainEditor />
            <RightSettingsPanel />
          </div>
        )}

      </div>

      {/* Collection Create Modal */}
      {isCreateModalOpen && (
        <div className="modal-backdrop bg-black bg-opacity-70 d-flex align-items-center justify-content-center p-3" style={{ position: 'fixed', inset: 0, zIndex: 1050 }}>
          <div className="glass-card p-4 rounded-4 border border-secondary w-100" style={{ maxWidth: '450px' }}>
            <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <Folder size={18} className="text-cyan" /> New Collection Folder
            </h5>
            <form onSubmit={handleCreateCollection} className="space-y-4">
              <div className="mb-3">
                <label className="form-label text-secondary small">Collection Name</label>
                <input
                  type="text"
                  value={colName}
                  onChange={(e) => setColName(e.target.value)}
                  placeholder="e.g. Q3 Marketing Campaigns"
                  className="form-control bg-dark border-secondary text-white rounded-3 focus-cyan"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary small">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={colDesc}
                  onChange={(e) => setColDesc(e.target.value)}
                  placeholder="Summarize target content..."
                  className="form-control bg-dark border-secondary text-white rounded-3 focus-cyan"
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-secondary small">Visibility</label>
                <select
                  value={colVis}
                  onChange={(e) => setColVis(e.target.value as any)}
                  className="form-select bg-dark border-secondary text-white rounded-3 focus-cyan"
                >
                  <option value="private">Private (Only Me)</option>
                  <option value="public">Public (Shared)</option>
                </select>
              </div>

              <div className="d-flex align-items-center justify-content-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setCreateModalOpen(false)}
                  className="btn btn-outline-secondary border-secondary rounded-3 text-light"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={createColMutation.isPending}
                  className="btn btn-cyan text-dark rounded-3 fw-bold"
                >
                  {createColMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Create Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collection Edit Modal */}
      {isEditModalOpen && activeCollection && (
        <div className="modal-backdrop bg-black bg-opacity-70 d-flex align-items-center justify-content-center p-3" style={{ position: 'fixed', inset: 0, zIndex: 1050 }}>
          <div className="glass-card p-4 rounded-4 border border-secondary w-100" style={{ maxWidth: '450px' }}>
            <h5 className="fw-bold text-white mb-3 d-flex align-items-center justify-content-between">
              <span className="d-flex align-items-center gap-2">
                <Folder size={18} className="text-cyan" /> Edit Collection Folder
              </span>
              <button 
                onClick={handleDeleteCollection}
                disabled={deleteColMutation.isPending}
                className="btn btn-outline-danger btn-xs rounded-2 border-danger text-danger hover-scale"
                title="Delete Collection"
              >
                <Trash2 size={14} />
              </button>
            </h5>
            <form onSubmit={handleUpdateCollection} className="space-y-4">
              <div className="mb-3">
                <label className="form-label text-secondary small">Collection Name</label>
                <input
                  type="text"
                  value={colName}
                  onChange={(e) => setColName(e.target.value)}
                  className="form-control bg-dark border-secondary text-white rounded-3 focus-cyan"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary small">Description</label>
                <textarea
                  rows={2}
                  value={colDesc}
                  onChange={(e) => setColDesc(e.target.value)}
                  className="form-control bg-dark border-secondary text-white rounded-3 focus-cyan"
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-secondary small">Visibility</label>
                <select
                  value={colVis}
                  onChange={(e) => setColVis(e.target.value as any)}
                  className="form-select bg-dark border-secondary text-white rounded-3 focus-cyan"
                >
                  <option value="private">Private (Only Me)</option>
                  <option value="public">Public (Shared)</option>
                </select>
              </div>

              <div className="d-flex align-items-center justify-content-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setEditModalOpen(false, null)}
                  className="btn btn-outline-secondary border-secondary rounded-3 text-light"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updateColMutation.isPending}
                  className="btn btn-cyan text-dark rounded-3 fw-bold"
                >
                  {updateColMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
