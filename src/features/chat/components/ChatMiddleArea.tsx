import React, { useEffect, useState, useRef } from 'react';
import { useMessageStore } from '../../../store/message-store';
import { useConversationStore } from '../../../store/conversation-store';
import { useChatStore } from '../../../store/chat-store';
import { MarkdownRenderer } from '../../../components/ui/MarkdownRenderer';
import { Send, RefreshCw, Edit3, Trash2, Copy, Bot, User, Sliders } from 'lucide-react';
import { Button } from '../../../components/ui';
import toast from 'react-hot-toast';

export const ChatMiddleArea: React.FC = () => {
  const { activeConversationId, conversations, updateConversation } = useConversationStore();
  const { messages, isLoading, isStreaming, fetchMessages, sendMessage, regenerateMessage, deleteMessage } = useMessageStore();
  const { isRightSidebarOpen, toggleRightSidebar } = useChatStore();

  const [inputVal, setInputVal] = useState('');
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c._id === activeConversationId);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId, fetchMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !activeConversationId) return;

    const content = inputVal.trim();
    setInputVal('');
    await sendMessage(activeConversationId, content);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const handleRegenerate = async (content: string) => {
    if (!activeConversationId) return;
    await regenerateMessage(activeConversationId, content);
  };

  const handleEditSubmit = async (messageId: string) => {
    if (!editVal.trim() || !activeConversationId) return;
    
    // Custom edit flow: deletes user message + AI response after it, and pushes edited prompt
    await deleteMessage(activeConversationId, messageId);
    setEditingMsgId(null);
    await sendMessage(activeConversationId, editVal.trim());
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
    <div className="d-flex flex-column h-100 flex-grow-1 bg-dark bg-opacity-40">
      {/* Top Navbar */}
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary">
        <div>
          <h5 className="fw-bold mb-0 text-light" style={{ fontFamily: 'Outfit' }}>
            {activeConv ? activeConv.title : 'AI Assistant Chat'}
          </h5>
          <span className="text-secondary" style={{ fontSize: '0.72rem' }}>
            Contextual continuous conversation workspace
          </span>
        </div>

        {activeConv && (
          <div className="d-flex align-items-center gap-3">
            {/* Provider Picker */}
            <select
              className="form-select form-select-sm bg-dark border-secondary text-light rounded-3 py-1"
              value={activeConv.provider}
              onChange={(e) => updateConversation(activeConv._id, { provider: e.target.value })}
              style={{ fontSize: '0.78rem', width: '110px' }}
            >
              <option value="openai">OpenAI</option>
              <option value="claude">Claude</option>
              <option value="gemini">Gemini</option>
            </select>

            {/* Category picker */}
            <select
              className="form-select form-select-sm bg-dark border-secondary text-light rounded-3 py-1"
              value={activeConv.category}
              onChange={(e) => updateConversation(activeConv._id, { category: e.target.value })}
              style={{ fontSize: '0.78rem', width: '150px' }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <button
              type="button"
              className={`btn btn-sm ${isRightSidebarOpen ? 'btn-purple text-white' : 'btn-outline-secondary text-secondary'} rounded-3 px-2.5 py-1.5`}
              onClick={toggleRightSidebar}
              title="Toggle Right Config Workspace"
            >
              <Sliders size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Messages Thread Port */}
      <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3" style={{ maxHeight: 'calc(100vh - 240px)' }}>
        {!activeConversationId ? (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center p-5 text-secondary">
            <Bot size={48} className="text-purple mb-3 opacity-40 animate-pulse" />
            <h5 className="fw-semibold text-light">Welcome to Truson-AI Conversational Assistant</h5>
            <p className="small max-w-sm mt-1">
              Select an existing chat session from the left menu or hit "New Conversation" to start refining your ideas.
            </p>
          </div>
        ) : isLoading && messages.length === 0 ? (
          <div className="text-center text-secondary small py-5 mt-5">Fetching message history...</div>
        ) : (
          <>
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg._id}
                  className={`d-flex gap-3 max-w-2xl ${isUser ? 'ms-auto flex-row-reverse' : ''}`}
                >
                  <div
                    className={`rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 ${
                      isUser ? 'bg-purple text-white' : 'bg-secondary bg-opacity-30 text-cyan'
                    }`}
                    style={{ width: 36, height: 36 }}
                  >
                    {isUser ? <User size={18} /> : <Bot size={18} />}
                  </div>

                  <div className="d-flex flex-column">
                    <div
                      className={`p-3.5 shadow-sm ${
                        isUser
                          ? 'chat-bubble-user text-light'
                          : 'chat-bubble-ai text-light'
                      }`}
                      style={{ minWidth: '200px' }}
                    >
                      {editingMsgId === msg._id ? (
                        <div>
                          <textarea
                            className="form-control form-control-sm bg-dark border-secondary text-light mb-2 small"
                            rows={3}
                            value={editVal}
                            onChange={(e) => setEditVal(e.target.value)}
                          />
                          <div className="d-flex justify-content-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingMsgId(null)}>
                              Cancel
                            </Button>
                            <Button size="sm" variant="glow" onClick={() => handleEditSubmit(msg._id)}>
                              Submit Edit
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <MarkdownRenderer content={msg.content} />
                      )}
                    </div>

                    {/* Action Panel icons */}
                    {editingMsgId !== msg._id && (
                      <div className={`d-flex gap-2.5 mt-1.5 px-2 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
                        <button
                          type="button"
                          className="btn btn-link text-secondary hover-text-white p-0"
                          onClick={() => handleCopy(msg.content)}
                          title="Copy text"
                        >
                          <Copy size={11} />
                        </button>
                        {isUser && (
                          <button
                            type="button"
                            className="btn btn-link text-secondary hover-text-white p-0"
                            onClick={() => {
                              setEditingMsgId(msg._id);
                              setEditVal(msg.content);
                            }}
                            title="Edit Prompt"
                          >
                            <Edit3 size={11} />
                          </button>
                        )}
                        {!isUser && (
                          <button
                            type="button"
                            className="btn btn-link text-secondary hover-text-white p-0"
                            onClick={() => {
                              // Find previous user message
                              const index = messages.findIndex((m) => m._id === msg._id);
                              if (index > 0 && messages[index - 1].sender === 'user') {
                                handleRegenerate(messages[index - 1].content);
                              }
                            }}
                            title="Regenerate Output"
                          >
                            <RefreshCw size={11} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-link text-secondary hover-text-danger p-0"
                          onClick={() => {
                            if (confirm('Delete this message from history logs?')) {
                              deleteMessage(activeConversationId, msg._id);
                            }
                          }}
                          title="Delete message"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isStreaming && (
              <div className="d-flex gap-3 max-w-2xl">
                <div className="rounded-circle p-2 d-flex align-items-center justify-content-center bg-secondary bg-opacity-30 text-cyan" style={{ width: 36, height: 36 }}>
                  <Bot size={18} />
                </div>
                <div className="p-3.5 bg-dark bg-opacity-40 border border-secondary rounded-4 text-secondary small d-flex align-items-center gap-2">
                  <span className="spinner-border spinner-border-sm text-cyan" role="status" />
                  Streaming AI response...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {/* Chat Form Area */}
      {activeConversationId && (
        <form onSubmit={handleSend} className="p-3 bg-dark bg-opacity-25 mt-auto">
          <div className="d-flex align-items-center chat-input-capsule p-2 mx-1">
            <textarea
              className="form-control chat-input-textarea flex-grow-1 text-light"
              placeholder="Ask anything, request code snippets, run design review commands..."
              rows={1}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              style={{ maxHeight: '120px', minHeight: '36px' }}
            />
            <button
              className="btn btn-purple rounded-circle p-2 ms-2 text-white border-0 d-flex align-items-center justify-content-center hover-glow"
              type="submit"
              disabled={isStreaming || !inputVal.trim()}
              style={{ width: '38px', height: '38px' }}
            >
              <Send size={15} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
