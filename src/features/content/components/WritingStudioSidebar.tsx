import React from 'react';
import { 
  FileText, Star, Archive, Folder, FolderPlus, 
  Sparkles, Plus, BookOpen 
} from 'lucide-react';
import { useContentStore } from '../store/content-store';
import { useCollectionStore } from '../store/collection-store';
import { useCollections, useTemplates } from '../hooks/useContent';

export const WritingStudioSidebar: React.FC = () => {
  const { 
    activeSidebarTab, 
    selectedCollectionId, 
    selectedTemplateId,
    setActiveSidebarTab, 
    setSelectedCollectionId,
    setSelectedTemplateId,
    setActiveDocument 
  } = useContentStore();

  const { setCreateModalOpen } = useCollectionStore();
  const { data: collectionsRes } = useCollections();
  const { data: templatesRes } = useTemplates();

  const collections = collectionsRes?.data || [];
  const templates = templatesRes?.data || [];

  const handleNewBlankDocument = () => {
    setActiveDocument({
      title: 'Untitled Document',
      category: 'General',
      contentType: 'Draft',
      editorMode: 'markdown',
      generatedContent: '',
      status: 'draft',
      tags: []
    });
    // Set view to all
    setActiveSidebarTab('all');
  };

  // Group templates by category
  const groupedTemplates = templates.reduce((acc: Record<string, typeof templates>, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});

  return (
    <div className="d-flex flex-column h-100 border-end border-secondary bg-dark-deep" style={{ width: '280px', minWidth: '280px' }}>
      {/* Sidebar Header Action */}
      <div className="p-3">
        <button 
          onClick={handleNewBlankDocument}
          className="btn btn-cyan w-100 py-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-bold text-dark shadow-sm hover-scale transition-all"
        >
          <Plus size={18} /> New Document
        </button>
      </div>

      <div className="flex-grow-1 overflow-y-auto px-2 pb-4 scrollbar-thin">
        {/* Basic Filters */}
        <div className="mb-4">
          <div className="px-3 text-secondary text-uppercase fw-semibold small mb-2 tracking-wider">Workspace</div>
          <ul className="nav flex-column gap-1">
            <li>
              <button 
                onClick={() => setActiveSidebarTab('all')}
                className={`nav-link w-100 text-start rounded-3 d-flex align-items-center gap-3 px-3 py-2 border-0 ${
                  activeSidebarTab === 'all' ? 'bg-cyan-subtle text-cyan' : 'text-light hover-bg'
                }`}
              >
                <FileText size={18} /> <span>All Documents</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveSidebarTab('favorites')}
                className={`nav-link w-100 text-start rounded-3 d-flex align-items-center gap-3 px-3 py-2 border-0 ${
                  activeSidebarTab === 'favorites' ? 'bg-cyan-subtle text-cyan' : 'text-light hover-bg'
                }`}
              >
                <Star size={18} /> <span>Favorites</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveSidebarTab('drafts')}
                className={`nav-link w-100 text-start rounded-3 d-flex align-items-center gap-3 px-3 py-2 border-0 ${
                  activeSidebarTab === 'drafts' ? 'bg-cyan-subtle text-cyan' : 'text-light hover-bg'
                }`}
              >
                <BookOpen size={18} /> <span>Drafts</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveSidebarTab('archived')}
                className={`nav-link w-100 text-start rounded-3 d-flex align-items-center gap-3 px-3 py-2 border-0 ${
                  activeSidebarTab === 'archived' ? 'bg-cyan-subtle text-cyan' : 'text-light hover-bg'
                }`}
              >
                <Archive size={18} /> <span>Archived</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Collections Section */}
        <div className="mb-4">
          <div className="px-3 d-flex align-items-center justify-content-between mb-2">
            <span className="text-secondary text-uppercase fw-semibold small tracking-wider">Collections</span>
            <button 
              onClick={() => setCreateModalOpen(true)}
              className="btn btn-link text-secondary p-0 hover-text-cyan border-0"
              title="Create Collection"
            >
              <FolderPlus size={16} />
            </button>
          </div>
          <ul className="nav flex-column gap-1">
            {collections.map((col) => (
              <li key={col._id}>
                <button
                  onClick={() => setSelectedCollectionId(col._id!)}
                  className={`nav-link w-100 text-start rounded-3 d-flex align-items-center justify-content-between px-3 py-2 border-0 ${
                    activeSidebarTab === 'collections' && selectedCollectionId === col._id
                      ? 'bg-cyan-subtle text-cyan'
                      : 'text-light hover-bg'
                  }`}
                >
                  <div className="d-flex align-items-center gap-3 text-truncate">
                    <Folder size={18} />
                    <span className="text-truncate">{col.name}</span>
                  </div>
                </button>
              </li>
            ))}
            {collections.length === 0 && (
              <div className="text-secondary text-center small py-2">No collections yet.</div>
            )}
          </ul>
        </div>

        {/* Templates Section */}
        <div>
          <div className="px-3 text-secondary text-uppercase fw-semibold small mb-2 tracking-wider">Templates Library</div>
          {Object.keys(groupedTemplates).map((category) => (
            <div key={category} className="mb-3">
              <div className="px-3 text-secondary-dim fw-medium small mb-1">{category}</div>
              <ul className="nav flex-column gap-1">
                {groupedTemplates[category].map((tmpl: any) => (
                  <li key={tmpl.id}>
                    <button
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      className={`nav-link w-100 text-start rounded-3 d-flex align-items-center gap-2 px-3 py-1.5 border-0 small ${
                        activeSidebarTab === 'templates' && selectedTemplateId === tmpl.id
                          ? 'bg-cyan-subtle text-cyan fw-semibold'
                          : 'text-light hover-bg'
                      }`}
                    >
                      <Sparkles size={14} className="text-cyan-dim" />
                      <span className="text-truncate">{tmpl.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
