import React, { useState } from 'react';
import { AIProviderSelector } from '../components/AIProviderSelector';
import { AIChatPanel, ChatMessage } from '../components/AIChatPanel';
import { AIPromptInput } from '../components/AIPromptInput';
import { AIOutputPanel } from '../components/AIOutputPanel';
import { AIGenerationHistory } from '../components/AIGenerationHistory';
import { useAIStore } from '../../../store/ai.store';
import { useHistoryStore } from '../../../store/history-store';
import { Sparkles, Edit3, Settings, Bot, Sliders } from 'lucide-react';
import { Button, Card, TextArea } from '../../../components/ui';
import toast from 'react-hot-toast';

export const AIWorkspacePage: React.FC = () => {
  const { activeProvider } = useAIStore();
  const { generateContent, executeAssistant, isLoading } = useHistoryStore();
  
  // View states
  const [activeTab, setActiveTab] = useState<'chat' | 'content-gen' | 'assistant'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [outputContent, setOutputContent] = useState<string>('');
  
  // Content Gen parameters
  const [category, setCategory] = useState('Blog Post');
  const [promptText, setPromptText] = useState('');
  
  // Assistant parameters
  const [action, setAction] = useState('rewrite');
  const [assistantText, setAssistantText] = useState('');
  const [toneInstructions, setToneInstructions] = useState('Professional');

  // Generation options
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);

  const categories = [
    'Blog Post',
    'Product Description',
    'SEO Article',
    'Landing Page Copy',
    'Marketing Copy',
    'Email Generator',
    'Social Media Content',
    'Business Proposal',
    'Business Plan',
    'Press Release',
    'Product Review',
    'FAQ Generator',
    'Documentation',
    'Technical Writing',
  ];

  const assistantActions = [
    { id: 'rewrite', label: 'Rewrite Content' },
    { id: 'improve', label: 'Improve Writing' },
    { id: 'expand', label: 'Expand Content' },
    { id: 'summarize', label: 'Summarize Content' },
    { id: 'humanize', label: 'Humanize AI Content' },
    { id: 'tone', label: 'Tone Adjustment' },
    { id: 'correct', label: 'Grammar Correction' },
  ];

  const handleSendChatPrompt = async (chatPrompt: string) => {
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: chatPrompt,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await generateContent({
        category: 'Workspace Chat',
        prompt: chatPrompt,
        providerId: activeProvider,
        temperature,
        maxTokens,
      });

      if (res) {
        const text = res.text || 'No response returned.';
        const aiMsg: ChatMessage = {
          id: `a_${Date.now()}`,
          sender: 'ai',
          text,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setOutputContent(text);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: `Generation error: ${err.message}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) {
      toast.error('Please enter content requirements.');
      return;
    }

    const res = await generateContent({
      category,
      prompt: promptText,
      providerId: activeProvider,
      temperature,
      maxTokens,
    });

    if (res) {
      setOutputContent(res.text);
    }
  };

  const handleExecuteAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantText.trim()) {
      toast.error('Please enter text to edit.');
      return;
    }

    const res = await executeAssistant({
      action,
      text: assistantText,
      instructions: action === 'tone' ? toneInstructions : undefined,
      providerId: activeProvider,
      temperature,
      maxTokens,
    });

    if (res) {
      setOutputContent(res.text);
    }
  };

  return (
    <div className="container-fluid px-0 h-100 d-flex flex-column">
      {/* Top Controls Bar */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between p-3 glass-card rounded-4 mb-3 gap-3">
        <div className="d-flex align-items-center gap-3">
          <h4 className="fw-bold mb-0 gradient-text" style={{ fontFamily: 'Outfit' }}>AI Workspace</h4>
          
          <div className="d-flex bg-dark p-1 rounded-pill border border-secondary">
            <button
              type="button"
              className={`btn btn-sm px-3 rounded-pill transition-all ${activeTab === 'chat' ? 'btn-purple text-white' : 'text-secondary hover-text-white'}`}
              onClick={() => setActiveTab('chat')}
            >
              <Bot size={14} className="me-1" /> Chat Mode
            </button>
            <button
              type="button"
              className={`btn btn-sm px-3 rounded-pill transition-all ${activeTab === 'content-gen' ? 'btn-purple text-white' : 'text-secondary hover-text-white'}`}
              onClick={() => setActiveTab('content-gen')}
            >
              <Sparkles size={14} className="me-1" /> Content Generator
            </button>
            <button
              type="button"
              className={`btn btn-sm px-3 rounded-pill transition-all ${activeTab === 'assistant' ? 'btn-purple text-white' : 'text-secondary hover-text-white'}`}
              onClick={() => setActiveTab('assistant')}
            >
              <Edit3 size={14} className="me-1" /> Writing Assistant
            </button>
          </div>
        </div>

        <AIProviderSelector />
      </div>

      {/* Split Screen Grid */}
      <div className="row g-3 flex-grow-1 overflow-hidden">
        {/* Left Column: Form Controls / Chat */}
        <div className="col-lg-7 d-flex flex-column h-100">
          {activeTab === 'chat' && (
            <div className="d-flex flex-column h-100">
              <AIChatPanel messages={messages} />
              <AIPromptInput onSend={handleSendChatPrompt} isLoading={isLoading} />
            </div>
          )}

          {activeTab === 'content-gen' && (
            <Card className="h-100 overflow-auto">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Sparkles className="text-purple" size={20} /> AI Content Generator
              </h5>
              
              <form onSubmit={handleGenerateContent}>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Select Content Category</label>
                  <select
                    className="form-select bg-dark border-secondary text-light rounded-3"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <TextArea
                  label="Content Requirements & Details"
                  rows={5}
                  placeholder="Describe what you want to write (e.g. A blog post about Microservices clean architecture advantages with key talking points...)"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                />

                <div className="row g-3 mb-4 mt-1 border-top border-secondary pt-3">
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold d-flex align-items-center justify-content-between">
                      <span>Temperature</span>
                      <span className="text-purple">{temperature}</span>
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Max Tokens Limit</label>
                    <select
                      className="form-select bg-dark border-secondary text-light rounded-3"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                    >
                      <option value={1024}>1,024 (Short)</option>
                      <option value={2048}>2,048 (Medium)</option>
                      <option value={4096}>4,096 (Long)</option>
                    </select>
                  </div>
                </div>

                <Button variant="glow" className="w-100" type="submit" isLoading={isLoading} leftIcon={<Sparkles size={16} />}>
                  Generate Content
                </Button>
              </form>
            </Card>
          )}

          {activeTab === 'assistant' && (
            <Card className="h-100 overflow-auto">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Edit3 className="text-cyan" size={20} /> AI Writing Assistant
              </h5>

              <form onSubmit={handleExecuteAssistant}>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Select Writing Action</label>
                  <div className="d-flex flex-wrap gap-2">
                    {assistantActions.map((act) => (
                      <button
                        key={act.id}
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 py-1.5 transition-all ${action === act.id ? 'btn-cyan text-dark fw-bold' : 'btn-dark border border-secondary text-secondary hover-text-white'}`}
                        onClick={() => setAction(act.id)}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                </div>

                {action === 'tone' && (
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-bold">Describe Target Tone</label>
                    <input
                      type="text"
                      className="form-control bg-dark border-secondary text-light rounded-3"
                      placeholder="e.g. Professional, Academic, Humorous, Casual..."
                      value={toneInstructions}
                      onChange={(e) => setToneInstructions(e.target.value)}
                    />
                  </div>
                )}

                <TextArea
                  label="Target Text to Modify"
                  rows={6}
                  placeholder="Paste your source text here..."
                  value={assistantText}
                  onChange={(e) => setAssistantText(e.target.value)}
                />

                <Button variant="glow" className="w-100 mt-3" type="submit" isLoading={isLoading} leftIcon={<Edit3 size={16} />}>
                  Run Assistant Edit
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* Right Column: Output Panel & History */}
        <div className="col-lg-5 d-flex flex-column gap-3 h-100 overflow-auto">
          <div className="flex-grow-1">
            <AIOutputPanel content={outputContent} model={activeProvider} />
          </div>
          <AIGenerationHistory onSelectHistoryText={setOutputContent} />
        </div>
      </div>
    </div>
  );
};
