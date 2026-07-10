import React, { useState, useEffect } from 'react';
import { PromptCategorySelector } from '../components/PromptCategorySelector';
import { Card, Button, TextArea } from '../../../components/ui';
import { Code2, Sparkles, Copy, Terminal, FileText, Heart, History, Trash2, FolderPlus, Search } from 'lucide-react';
import { usePromptStore } from '../../../store/prompt-store';
import { usePromptLibraryStore } from '../../../store/prompt-library-store';
import toast from 'react-hot-toast';

export const PromptWorkspacePage: React.FC = () => {
  // Store for compiled generations
  const {
    generatedPrompt,
    isLoading: isGenerating,
    generatePrompt,
  } = usePromptStore();

  // Store for database library persistence
  const {
    savedPrompts,
    isLoading: isLibraryLoading,
    searchQuery,
    categoryFilter,
    languageFilter,
    setSearchQuery,
    setCategoryFilter,
    setLanguageFilter,
    fetchLibrary,
    saveToLibrary,
    deleteFromLibrary,
  } = usePromptLibraryStore();

  const [selectedLanguage, setSelectedLanguage] = useState('TypeScript');
  const [selectedFramework, setSelectedFramework] = useState('React');
  const [selectedArea, setSelectedArea] = useState('Frontend');
  const [requirements, setRequirements] = useState('');
  
  // Custom Generation parameters
  const [complexity, setComplexity] = useState('Senior');
  const [style, setStyle] = useState('Explanatory');
  const [projectType, setProjectType] = useState('SaaS Platform');
  
  const [activeTab, setActiveTab] = useState<'generate' | 'library'>('generate');

  // Tags input for saving to library
  const [tagsInput, setTagsInput] = useState('clean-code, scalable');

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary, searchQuery, categoryFilter, languageFilter]);

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

  const handleSaveToLibrary = async () => {
    if (!generatedPrompt) {
      toast.error('Generate a prompt first before saving');
      return;
    }

    const tagsArray = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const card = await saveToLibrary({
      prompt: generatedPrompt,
      category: selectedArea,
      programmingLanguage: selectedLanguage,
      framework: selectedFramework,
      tags: tagsArray,
    });

    if (card) {
      toast.success('Prompt successfully cataloged in library!');
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleExportText = (text: string, format: 'txt' | 'md') => {
    const fileContent = format === 'md' 
      ? `# Generated Developer Prompt\n\n${text}`
      : text;
    
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `developer-prompt-${Date.now()}.${format}`;
    link.click();
    toast.success(`Exported as ${format.toUpperCase()}!`);
  };

  // Static list for filtering
  const languages = ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'PHP', 'Go', 'Rust', 'Ruby'];
  const categories = ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps', 'Cloud', 'AI', 'APIs', 'Databases', 'Testing', 'Security', 'Architecture'];

  return (
    <div className="container-fluid px-0">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-3 border-bottom border-secondary gap-3">
        <div>
          <h2 className="fw-bold d-flex align-items-center gap-2 mb-1" style={{ fontFamily: 'Outfit' }}>
            <Code2 className="text-purple" /> AI Prompt Generator Workspace
          </h2>
          <p className="text-secondary mb-0">
            Generate and save production-ready prompts cataloged by framework, tags, and languages.
          </p>
        </div>
        
        <div className="d-flex bg-dark p-1 rounded-pill border border-secondary flex-shrink-0">
          <button
            type="button"
            className={`btn btn-sm px-3 rounded-pill transition-all ${activeTab === 'generate' ? 'btn-purple text-white' : 'text-secondary hover-text-white'}`}
            onClick={() => setActiveTab('generate')}
          >
            <Sparkles size={14} className="me-1" /> Prompt Generator
          </button>
          <button
            type="button"
            className={`btn btn-sm px-3 rounded-pill transition-all ${activeTab === 'library' ? 'btn-purple text-white' : 'text-secondary hover-text-white'}`}
            onClick={() => setActiveTab('library')}
          >
            <History size={14} className="me-1" /> Saved Library ({savedPrompts.length})
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
            {/* Form */}
            <div className="col-lg-6">
              <Card>
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-cyan">
                  <Terminal size={20} /> Parameter Configuration
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
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Principal">Principal</option>
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
                        <option value="Minimalist">Minimalist</option>
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
                    label="Explain what prompt you want to build"
                    rows={5}
                    placeholder="e.g. Build a robust controller validation pattern using NestJS filters..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                  />

                  <Button variant="glow" className="w-100 mt-2" type="submit" isLoading={isGenerating} leftIcon={<Sparkles size={18} />}>
                    Compile Prompt
                  </Button>
                </form>
              </Card>
            </div>

            {/* Generated card */}
            <div className="col-lg-6">
              <Card className="h-100 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold mb-0">Compiled Prompt Output</h5>
                  {generatedPrompt && (
                    <div className="d-flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleCopyText(generatedPrompt)} leftIcon={<Copy size={14} />}>
                        Copy
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleExportText(generatedPrompt, 'md')} leftIcon={<FileText size={14} />}>
                        Export
                      </Button>
                    </div>
                  )}
                </div>

                {generatedPrompt ? (
                  <div className="d-flex flex-column flex-grow-1">
                    <div className="flex-grow-1 p-3 bg-dark border border-secondary rounded-3 text-mono text-light overflow-auto small mb-3" style={{ maxHeight: '300px' }}>
                      <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{generatedPrompt}</pre>
                    </div>

                    {/* Library Save Form */}
                    <div className="p-3 bg-dark bg-opacity-40 border border-secondary rounded-3">
                      <div className="mb-2">
                        <label className="form-label text-secondary small fw-bold">Tags (Comma-separated)</label>
                        <input
                          type="text"
                          className="form-control form-control-sm bg-dark border-secondary text-light rounded-3"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                        />
                      </div>
                      <Button variant="glow" size="sm" className="w-100" onClick={handleSaveToLibrary} leftIcon={<FolderPlus size={14} />}>
                        Save Prompt to Library Card
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center p-5 text-secondary">
                    <Code2 size={48} className="mb-3 opacity-30 text-purple" />
                    <h6>No prompt generated yet</h6>
                    <p className="small">Configure options and click "Compile Prompt".</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </>
      ) : (
        /* Library Viewer */
        <div className="row g-4">
          <div className="col-12">
            <Card>
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Heart size={20} className="text-purple" /> Saved Prompt Library
                </h5>

                {/* Filters */}
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <div className="position-relative" style={{ width: '200px' }}>
                    <span className="position-absolute top-50 start-0 translate-middle-y ps-2.5 text-secondary"><Search size={13} /></span>
                    <input
                      type="text"
                      className="form-control form-control-sm bg-dark border-secondary ps-5 text-light rounded-3"
                      placeholder="Search saved cards..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <select
                    className="form-select form-select-sm bg-dark border-secondary text-secondary rounded-3"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{ width: '130px' }}
                  >
                    <option value="">All Areas</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <select
                    className="form-select form-select-sm bg-dark border-secondary text-secondary rounded-3"
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    style={{ width: '130px' }}
                  >
                    <option value="">All Langs</option>
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>

              {isLibraryLoading && savedPrompts.length === 0 ? (
                <div className="text-center py-5 text-secondary">Loading library...</div>
              ) : savedPrompts.length === 0 ? (
                <div className="text-center py-5 text-secondary">
                  <h6>No saved prompt cards found matching the criteria.</h6>
                  <p className="small">Generate a prompt card and add it to library.</p>
                </div>
              ) : (
                <div className="row g-3">
                  {savedPrompts.map((item) => (
                    <div key={item._id} className="col-md-6">
                      <div className="glass-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between border border-secondary border-opacity-70">
                        <div>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="badge bg-purple-subtle text-purple border border-purple px-2 py-0.8" style={{ fontSize: '0.7rem' }}>
                              {item.category}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm p-1 text-secondary hover-text-danger"
                              onClick={() => deleteFromLibrary(item._id)}
                              title="Delete from Library"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          <h6 className="fw-bold text-light mb-2">
                            {item.programmingLanguage.toUpperCase()} - {item.framework}
                          </h6>

                          <div className="p-3 bg-dark bg-opacity-70 border border-secondary rounded-3 text-mono text-light mb-3 small" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: '0.8rem' }}>{item.prompt}</pre>
                          </div>

                          {/* Tags list */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="d-flex flex-wrap gap-1 mb-3">
                              {item.tags.map((tag) => (
                                <span key={tag} className="badge bg-dark text-cyan border border-secondary rounded-pill" style={{ fontSize: '0.65rem' }}>
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="d-flex gap-2 pt-2 border-top border-secondary border-opacity-35">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-100"
                            onClick={() => handleCopyText(item.prompt)}
                            leftIcon={<Copy size={13} />}
                          >
                            Copy
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-100"
                            onClick={() => handleExportText(item.prompt, 'md')}
                            leftIcon={<FileText size={13} />}
                          >
                            Export
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
