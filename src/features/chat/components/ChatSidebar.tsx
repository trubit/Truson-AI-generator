import React, { useEffect } from 'react';
import { useConversationStore } from '../../../store/conversation-store';
import { useChatStore } from '../../../store/chat-store';
import { Search, Plus, Pin, Heart, Trash2, Edit2, Bot } from 'lucide-react';

export const ChatSidebar: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    searchQuery,
    categoryFilter,
    providerFilter,
    setSearchQuery,
    setCategoryFilter,
    setProviderFilter,
    setActiveConversationId,
    fetchConversations,
    createConversation,
    togglePin,
    toggleFavorite,
    deleteConversation,
    renameConversation,
  } = useConversationStore();

  const { activeSidebarTab, setActiveSidebarTab } = useChatStore();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations, searchQuery, categoryFilter, providerFilter]);

  const handleCreateChat = async () => {
    const title = `New Conversation ${conversations.length + 1}`;
    await createConversation({ title, category: 'General Writing', provider: 'gemini' });
  };

  const handleRename = async (id: string) => {
    const newTitle = prompt('Enter new conversation title:');
    if (newTitle && newTitle.trim()) {
      await renameConversation(id, newTitle.trim());
    }
  };

  // Categories list
  const categories = [
    'General Writing',
    'Programming',
    'Code Explanation',
    'Code Review',
    'Debugging',
    'Architecture',
    'API Design',
    'Database Design',
  ];

  return (
    <div className="d-flex flex-column h-100 border-end border-secondary bg-dark bg-opacity-70 p-3" style={{ width: '280px' }}>
      {/* Create New Chat */}
      <button
        type="button"
        className="btn btn-purple text-white w-100 rounded-3 py-2.5 mb-3 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-lg transition-all hover-glow"
        onClick={handleCreateChat}
      >
        <Plus size={16} /> New Conversation
      </button>

      {/* Search Input */}
      <div className="position-relative mb-3">
        <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary">
          <Search size={14} />
        </span>
        <input
          type="text"
          className="form-control form-control-sm bg-dark bg-opacity-50 border-secondary ps-5 text-light rounded-3"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Search Filters */}
      <div className="row g-2 mb-3">
        <div className="col-6">
          <select
            className="form-select form-select-sm bg-dark border-secondary text-secondary rounded-3"
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            style={{ fontSize: '0.75rem' }}
          >
            <option value="">All Models</option>
            <option value="openai">OpenAI</option>
            <option value="claude">Claude</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>
        <div className="col-6">
          <select
            className="form-select form-select-sm bg-dark border-secondary text-secondary rounded-3"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ fontSize: '0.75rem' }}
          >
            <option value="">All Domains</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex bg-dark bg-opacity-50 p-1 rounded-3 mb-3 border border-secondary">
        <button
          type="button"
          className={`btn btn-sm flex-grow-1 py-1 rounded-2 transition-all ${
            activeSidebarTab === 'conversations' ? 'bg-purple text-white small' : 'text-secondary small'
          }`}
          onClick={() => setActiveSidebarTab('conversations')}
          style={{ fontSize: '0.7rem' }}
        >
          All
        </button>
        <button
          type="button"
          className={`btn btn-sm flex-grow-1 py-1 rounded-2 transition-all ${
            activeSidebarTab === 'favorites' ? 'bg-purple text-white small' : 'text-secondary small'
          }`}
          onClick={() => setActiveSidebarTab('favorites')}
          style={{ fontSize: '0.7rem' }}
        >
          Starred
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-grow-1 overflow-auto d-flex flex-column gap-2 pe-1" style={{ maxHeight: 'calc(100vh - 350px)' }}>
        {conversations
          .filter((c) => activeSidebarTab === 'favorites' ? c.isFavorite : true)
          .map((conv) => {
            const isActive = conv._id === activeConversationId;
            return (
              <div
                key={conv._id}
                className={`p-3 cursor-pointer d-flex flex-column chat-sidebar-card ${
                  isActive
                    ? 'chat-sidebar-card-active border-purple'
                    : 'border-transparent'
                }`}
                onClick={() => setActiveConversationId(conv._id)}
              >
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <div className="d-flex align-items-center gap-2 overflow-hidden w-75">
                    <Bot size={13} className={isActive ? 'text-purple' : 'text-cyan'} />
                    <span className={`small text-truncate ${isActive ? 'text-light fw-bold' : 'text-secondary'}`} style={{ fontSize: '0.8rem' }}>
                      {conv.title}
                    </span>
                  </div>

                  <div className="d-flex gap-1.5 align-items-center">
                    {conv.isPinned && <Pin size={10} className="text-purple" />}
                    {conv.isFavorite && <Heart size={10} className="text-purple" fill="currentColor" />}
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-1 pt-1.5 border-top border-secondary border-opacity-30">
                  <span className="badge bg-dark text-secondary border border-secondary px-1 py-0.5" style={{ fontSize: '0.62rem' }}>
                    {conv.provider.toUpperCase()}
                  </span>
                  
                  {/* Actions Dropdown / Icons */}
                  <div className="d-flex gap-1">
                    <button
                      type="button"
                      className="btn btn-link text-secondary hover-text-white p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(conv._id);
                      }}
                      title="Pin Conversation"
                    >
                      <Pin size={11} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-link text-secondary hover-text-white p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(conv._id);
                      }}
                      title="Star Conversation"
                    >
                      <Heart size={11} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-link text-secondary hover-text-white p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRename(conv._id);
                      }}
                      title="Rename Chat"
                    >
                      <Edit2 size={11} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-link text-secondary hover-text-danger p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this conversation thread?')) {
                          deleteConversation(conv._id);
                        }
                      }}
                      title="Delete Chat"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

        {conversations.length === 0 && (
          <div className="text-center text-secondary small py-4 mt-3">
            No chats logged.
          </div>
        )}
      </div>
    </div>
  );
};
