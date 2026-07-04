import React, { useState } from 'react';
import { PromptCategorySelector } from '../components/PromptCategorySelector';
import { Card, Button, Input, TextArea } from '../../../components/ui';
import { Code2, Sparkles, Copy, Check, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';

export const PromptWorkspacePage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('TypeScript');
  const [selectedFramework, setSelectedFramework] = useState('React');
  const [selectedArea, setSelectedArea] = useState('Frontend');
  const [requirements, setRequirements] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirements.trim()) {
      toast.error('Please enter prompt requirements');
      return;
    }

    const template = `You are an expert Principal Engineer in ${selectedLanguage} and ${selectedFramework} specializing in ${selectedArea}.\n\nTask: ${requirements}\n\nRequirements:\n1. Adhere to enterprise SOLID principles.\n2. Include strict input validation with Zod.\n3. Implement error handling & logging.\n4. Provide production-ready ${selectedLanguage} code without placeholder comments.`;

    setGeneratedPrompt(template);
    toast.success('Prompt Architecture Generated!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    toast.success('Prompt copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container-fluid px-0">
      <div className="mb-4">
        <h2 className="fw-bold d-flex align-items-center gap-2">
          <Code2 className="text-purple" /> AI Prompt Generator Workspace
        </h2>
        <p className="text-secondary">
          Generate targeted engineering prompts for 40+ languages, frameworks, and architecture areas.
        </p>
      </div>

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
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Terminal className="text-cyan" size={20} /> Prompt Parameters
            </h5>

            <form onSubmit={handleGenerate}>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">Active Selection</label>
                <div className="p-3 bg-dark border border-secondary rounded-3 text-light small d-flex flex-wrap gap-2">
                  <span className="badge bg-purple-subtle text-purple border border-purple">{selectedArea}</span>
                  <span className="badge bg-cyan-subtle text-cyan border border-cyan">{selectedLanguage}</span>
                  <span className="badge bg-secondary-subtle text-secondary border border-secondary">{selectedFramework}</span>
                </div>
              </div>

              <TextArea
                label="Requirements & Feature Scope"
                rows={5}
                placeholder="e.g. Build a resilient auth middleware with JWT refresh tokens and rate limiting..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />

              <Button variant="glow" className="w-100 mt-2" type="submit" leftIcon={<Sparkles size={18} />}>
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
                <Button variant="outline" size="sm" onClick={handleCopy} leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}>
                  {copied ? 'Copied' : 'Copy'}
                </Button>
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
    </div>
  );
};
