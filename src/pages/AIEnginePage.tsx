import React, { useEffect, useState } from 'react';
import { useAIStore } from '../store/ai.store';
import { apiClient } from '../api/client';
import { Cpu, CheckCircle2, RefreshCw, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export const AIEnginePage: React.FC = () => {
  const { activeProvider, providers, fetchProviders, switchProvider } = useAIStore();
  const [testPrompt, setTestPrompt] = useState('Explain the Provider Abstraction Pattern in Node.js');
  const [testResult, setTestResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleTestCompletion = async () => {
    try {
      setIsExecuting(true);
      const res = await apiClient.post('/ai/completion', {
        prompt: testPrompt,
        providerId: activeProvider,
      });

      if (res.data.success) {
        setTestResult(res.data.data);
        toast.success(`Generated output via ${res.data.data.provider.toUpperCase()} engine!`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Execution failed.');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="container-fluid px-0">
      <div className="mb-4">
        <h2 className="fw-bold d-flex align-items-center gap-2">
          <Cpu className="text-purple" /> AI Engine Provider Abstraction Layer
        </h2>
        <p className="text-secondary">
          Zero-coupling AI Provider Strategy registry supporting OpenAI, Anthropic Claude, and Google Gemini.
        </p>
      </div>

      <div className="row g-4 mb-4">
        {providers.map((p) => {
          const isActive = p.id === activeProvider;
          return (
            <div key={p.id} className="col-md-4">
              <div
                className={`glass-card p-4 rounded-4 h-100 ${
                  isActive ? 'border-purple shadow-lg' : ''
                }`}
                style={isActive ? { borderColor: '#8b5cf6' } : {}}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold mb-0">{p.name}</h5>
                  {isActive ? (
                    <span className="badge bg-purple-subtle text-purple border border-purple px-2 py-1">
                      <CheckCircle2 size={12} className="me-1" /> Active
                    </span>
                  ) : (
                    <button
                      onClick={() => switchProvider(p.id)}
                      className="btn btn-sm btn-outline-purple text-light"
                    >
                      Set Active
                    </button>
                  )}
                </div>

                <p className="text-secondary small mb-3">{p.description}</p>

                <div className="border-top border-secondary pt-3">
                  <div className="text-secondary small fw-semibold mb-1">Supported Models:</div>
                  <div className="d-flex flex-wrap gap-1">
                    {p.models?.map((m) => (
                      <span key={m} className="badge bg-dark text-secondary border border-secondary">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Provider Test Console */}
      <div className="glass-card p-4 rounded-4">
        <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <Zap className="text-warning" size={20} /> Provider Abstraction Live Test Console
        </h4>
        <p className="text-secondary small mb-3">
          Test `generateCompletion()` call via the current active registry provider (`{activeProvider.toUpperCase()}`).
        </p>

        <div className="row g-3">
          <div className="col-lg-6">
            <label className="form-label text-secondary small fw-semibold">Prompt Input</label>
            <textarea
              className="form-control bg-dark border-secondary text-light mb-3"
              rows={4}
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
            />
            <button
              onClick={handleTestCompletion}
              disabled={isExecuting}
              className="btn glow-btn w-100 d-flex align-items-center justify-content-center gap-2"
            >
              {isExecuting ? <RefreshCw className="spin" size={16} /> : <Zap size={16} />}
              Test {activeProvider.toUpperCase()} Completion
            </button>
          </div>

          <div className="col-lg-6">
            <label className="form-label text-secondary small fw-semibold">Provider Output</label>
            <div className="p-3 bg-dark border border-secondary rounded-3 text-mono text-light h-100 min-vh-20 overflow-auto small">
              {testResult ? (
                <div>
                  <div className="text-purple fw-bold mb-2">
                    [Latency: {testResult.latencyMs}ms | Model: {testResult.model}]
                  </div>
                  <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{testResult.text}</pre>
                </div>
              ) : (
                <span className="text-secondary opacity-50">Result will appear here...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
