import React, { useState } from 'react';
import { PROMPT_CATEGORIES, PROMPT_TYPES, TECH_STACKS } from '@shared/constants/prompt-categories.constants';
import { PromptCategory, PromptType, TechStackId } from '@shared/types/prompt.types';
import { apiClient } from '../api/client';
import { Code2, Sparkles, Send, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const PromptsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>('Frontend');
  const [selectedType, setSelectedType] = useState<PromptType>('Coding');
  const [selectedTech, setSelectedTech] = useState<TechStackId>('react');
  const [requirements, setRequirements] = useState('');
  const [architectureDetails, setArchitectureDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const filteredTechStacks = TECH_STACKS.filter((t) => t.category === selectedCategory);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirements.trim()) {
      toast.error('Please enter prompt requirements.');
      return;
    }

    try {
      setIsGenerating(true);
      const response = await apiClient.post('/prompts/prepare', {
        category: selectedCategory,
        promptType: selectedType,
        techStack: selectedTech,
        requirements,
        architectureDetails,
      });

      if (response.data.success) {
        setResult(response.data.data);
        toast.success('Prompt architecture scaffolded!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.generatedPrompt) {
      navigator.clipboard.writeText(result.generatedPrompt);
      setCopied(true);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container-fluid px-0">
      <div className="mb-4">
        <h2 className="fw-bold d-flex align-items-center gap-2">
          <Code2 className="text-purple" /> AI Prompt Generator for Developers
        </h2>
        <p className="text-secondary">
          Architecture Foundation for 40+ technologies, frameworks, and engineering prompt types.
        </p>
      </div>

      <div className="row g-4">
        {/* Generator Form */}
        <div className="col-lg-6">
          <div className="glass-card p-4 rounded-4">
            <form onSubmit={handleGenerate}>
              {/* Category Select */}
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold small">Category</label>
                <div className="d-flex flex-wrap gap-2">
                  {PROMPT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`btn btn-sm rounded-pill ${
                        selectedCategory === cat
                          ? 'btn-purple gradient-btn text-white'
                          : 'btn-outline-secondary text-light'
                      }`}
                      onClick={() => {
                        setSelectedCategory(cat);
                        const firstTech = TECH_STACKS.find((t) => t.category === cat);
                        if (firstTech) setSelectedTech(firstTech.id);
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tech Stack Select */}
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold small">Target Tech Stack</label>
                <select
                  className="form-select bg-dark border-secondary text-light"
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value as TechStackId)}
                >
                  {filteredTechStacks.length > 0 ? (
                    filteredTechStacks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))
                  ) : (
                    <option value={selectedTech}>{selectedTech}</option>
                  )}
                </select>
              </div>

              {/* Prompt Type */}
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold small">Prompt Type</label>
                <select
                  className="form-select bg-dark border-secondary text-light"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as PromptType)}
                >
                  {PROMPT_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Requirements Input */}
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold small">Requirements</label>
                <textarea
                  className="form-rows form-control bg-dark border-secondary text-light"
                  rows={4}
                  placeholder="e.g. Build a resilient auth middleware with JWT refresh tokens and rate limiting..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                />
              </div>

              {/* Architecture Details Input */}
              <div className="mb-4">
                <label className="form-label text-secondary fw-semibold small">
                  Architecture Details (Optional)
                </label>
                <textarea
                  className="form-control bg-dark border-secondary text-light"
                  rows={2}
                  placeholder="e.g. Must adhere to Clean Architecture with Repository pattern..."
                  value={architectureDetails}
                  onChange={(e) => setArchitectureDetails(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="btn glow-btn w-100 d-flex align-items-center justify-content-center gap-2 py-2.5"
              >
                {isGenerating ? (
                  <span>Generating Prompt...</span>
                ) : (
                  <>
                    <Sparkles size={18} /> Prepare Prompt Architecture
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Output Output Preview */}
        <div className="col-lg-6">
          <div className="glass-card p-4 rounded-4 h-100 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0">Generated Prompt Preview</h5>
              {result && (
                <button
                  onClick={copyToClipboard}
                  className="btn btn-sm btn-outline-secondary text-light d-flex align-items-center gap-1"
                >
                  {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            {result ? (
              <div className="flex-grow-1 d-flex flex-column">
                <div className="p-3 bg-dark border border-secondary rounded-3 text-mono text-light flex-grow-1 overflow-auto small">
                  <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{result.generatedPrompt}</pre>
                </div>
                <div className="mt-3 p-3 bg-secondary bg-opacity-20 border border-secondary rounded-3">
                  <div className="fw-semibold small text-purple mb-1">Architecture Best Practices:</div>
                  <ul className="mb-0 text-secondary small ps-3">
                    {result.meta?.bestPractices?.map((bp: string, i: number) => (
                      <li key={i}>{bp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center p-5 text-secondary">
                <Send size={48} className="mb-3 opacity-30 text-purple" />
                <h6>No prompt generated yet</h6>
                <p className="small">
                  Fill out the parameters on the left and click "Prepare Prompt Architecture".
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
