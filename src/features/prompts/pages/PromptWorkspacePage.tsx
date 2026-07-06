import React, { useState, useEffect } from 'react';
import { PromptCategorySelector } from '../components/PromptCategorySelector';
import { Card, Button, TextArea } from '../../../components/ui';
import { Code2, Sparkles, Copy, Check, Terminal, FileText, Heart, History, Trash2 } from 'lucide-react';
import { usePromptStore } from '../../../store/prompt-store';
import toast from 'react-hot-toast';

export const PromptWorkspacePage: React.FC = () => {
  const {
    promptHistory,
    generatedPrompt,
    isLoading,
    fetchHistory,
    generatePrompt,
    toggleFavorite,
  } = usePromptStore();

  const [selectedLanguage, setSelectedLanguage] = useState('TypeScript');
  const [selectedFramework, setSelectedFramework] = useState('React');
  const [selectedArea, setSelectedArea] = useState('Frontend');
  const [requirements, setRequirements] = useState('');
  
  // Custom Generation selectors
  const [complexity, setComplexity] = useState('Senior');
  const [style, setStyle] = useState('Explanatory');
  const [projectType, setProjectType] = useState('SaaS Platform');
  
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirements.trim()) {
      toast.error('Please enter prompt requirements');
      return;
    }

    const architectureDetails = `Framework: ${selectedFramework}, Project Type: ${projectType}, Style: ${style}, Complexity: ${complexity}`;
    
    await generatePrompt({
      category: selectedArea,
      promptType: 'Coding',
      techStack: selectedLanguage.toLowerCase().replace('.', ''),
      requirements,
      architectureDetails,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    toast.success('Prompt copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = (format: 'txt' | 'md') => {
    const fileContent = format === 'md' 
      ? `# Generated Developer Prompt\n\n${generatedPrompt}`
      : generatedPrompt;
    
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `developer-prompt-${Date.now()}.${format}`;
    link.click();
    toast.success(`Exported as ${format.toUpperCase()}!`);
  };

  return (
    <div className="container-fluid px-0">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-3 border-bottom border-secondary gap-3">
        <div>
          <h2 className="fw-bold d-flex align-items-center gap-2 mb-1" style={{ fontFamily: 'Outfit' }}>
            <Code2 className="text-purple" /> AI Prompt Generator Workspace
          </h2>
          <p className="text-secondary mb-0">
            Generate production-ready code prompts for 40+ technologies, databases, and microservices.
          </p>
        </div>
        
        <div className="d-flex bg-dark p-1 rounded-pill border border-secondary flex-shrink-0">
          <button
            type="button"
            className={`btn btn-sm px-3 rounded-pill transition-all ${activeTab === 'generate' ? 'btn-purple text-white' : 'text-secondary hover-text-white'}`}
            onClick={() => setActiveTab('generate')}
          >
            <Sparkles size={14} className="me-1" /> Generator
          </button>
          <button
            type="button"
            className={`btn btn-sm px-3 rounded-pill transition-all ${activeTab === 'history' ? 'btn-purple text-white' : 'text-secondary hover-text-white'}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={14} className="me-1" /> Saved Prompts ({promptHistory.length})
          </button>
        </div>
      </div>

      {activeTab === 'generate' ? (
        <>
          <PromptCategorySelector
            selectedLanguage={selectedLanguage}
            selectedFramework={selectedFramework}
            selectedArea={selectedArea}
            onLanguageChange={setSelectedLanguage}
            onFrameworkChange={setSelectedFramework}
            onAreaChange={setSelectedArea}
          />

          <div className="row g-4">
            {/* Input Form */}
            <div className="col-lg-6">
              <Card>
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-cyan">
                  <Terminal size={20} /> Generation Settings
                </h5>

                <form onSubmit={handleGenerate}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label text-secondary small fw-bold">Complexity</label>
                      <select
                        className="form-select bg-dark border-secondary text-light rounded-3"
                        value={complexity}
                        onChange={(e) => setComplexity(e.target.value)}
                      >
                        <option value="Junior">Junior Dev</option>
                        <option value="Senior">Senior Dev</option>
                        <option value="Principal">Principal Dev</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-secondary small fw-bold">Style</label>
                      <select
                        className="form-select bg-dark border-secondary text-light rounded-3"
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                      >
                        <option value="Explanatory">Explanatory</option>
                        <option value="Minimalist">Minimalist Code</option>
                        <option value="Documented">Self-Documenting</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-secondary small fw-bold">Project Type</label>
                      <select
                        className="form-select bg-dark border-secondary text-light rounded-3"
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                      >
                        <option value="SaaS Platform">SaaS Platform</option>
                        <option value="FinTech System">FinTech API</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Microservices">Microservices</option>
                      </select>
                    </div>
                  </div>

                  <TextArea
                    label="Prompt Requirements & Scope"
                    rows={5}
                    placeholder="e.g. Build a resilient auth middleware with JWT refresh tokens and rate limiting..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                  />

                  <Button variant="glow" className="w-100 mt-2" type="submit" isLoading={isLoading} leftIcon={<Sparkles size={18} />}>
                    Generate Enterprise Prompt
                  </Button>
                </form>
              </Card>
            </div>

            {/* Output Preview */}
            <div className="col-lg-6">
              <Card className="h-100 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold mb-0">Generated Prompt Result</h5>
                  {generatedPrompt && (
                    <div className="d-flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy} leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}>
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleExport('md')} leftIcon={<FileText size={14} />}>
                        Markdown
                      </Button>
                    </div>
                  )}
                </div>

                {generatedPrompt ? (
                  <div className="flex-grow-1 p-3 bg-dark border border-secondary rounded-3 text-mono text-light overflow-auto small">
                    <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{generatedPrompt}</pre>
                  </div>
                ) : (
                  <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center p-5 text-secondary">
                    <Code2 size={48} className="mb-3 opacity-30 text-purple" />
                    <h6>No prompt generated yet</h6>
                    <p className="small">
                      Select your technology options above and click "Generate Enterprise Prompt".
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </>
      ) : (
        /* History & Favorites Listing */
        <div className="row g-4">
          <div className="col-100">
            <Card>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <History size={20} className="text-purple" /> Prompt History logs
              </h5>

              {promptHistory.length === 0 ? (
                <div className="text-center py-5 text-secondary">
                  <h6>No prompts saved in database.</h6>
                  <p className="small">Perform your first generation above to log it automatically.</p>
                </div>
              ) : (
                <div className="row g-3">
                  {promptHistory.map((item) => (
                    <div key={item._id} className="col-md-6">
                      <div className="glass-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="badge bg-purple-subtle text-purple border border-purple">
                              {item.promptCategory}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm p-1 text-secondary hover-text-danger"
                              onClick={() => toggleFavorite(item._id)}
                            >
                              <Heart size={16} fill={item.favoriteStatus ? 'var(--accent-purple)' : 'none'} className={item.favoriteStatus ? 'text-purple' : ''} />
                            </button>
                          </div>
                          <h6 className="fw-bold text-light mb-2">{item.promptType}: {item.programmingLanguage.toUpperCase()}</h6>
                          <div className="p-3 bg-dark bg-opacity-70 border border-secondary rounded-3 text-mono text-light mb-3 small" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: '0.8rem' }}>{item.generatedPrompt}</pre>
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-100"
                            onClick={() => {
                              navigator.clipboard.writeText(item.generatedPrompt);
                              toast.success('Prompt copied to clipboard!');
                            }}
                            leftIcon={<Copy size={13} />}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
