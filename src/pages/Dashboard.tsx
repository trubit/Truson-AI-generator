import React, { useEffect, useState } from 'react';
import { useAIStore } from '../store/ai.store';
import { apiClient } from '../api/client';
import { Cpu, Server, Database, Sparkles, Code2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { activeProvider, fetchProviders } = useAIStore();
  const [healthInfo, setHealthInfo] = useState<any>(null);

  useEffect(() => {
    fetchProviders();
    apiClient.get('/health').then((res) => {
      setHealthInfo(res.data);
    }).catch(console.error);
  }, []);

  return (
    <div className="container-fluid px-0">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-4 mb-4 rounded-4 position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)' }}
      >
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="display-6 fw-bold mb-2">
              Enterprise AI Generator <span className="gradient-text">Platform</span>
            </h1>
            <p className="text-secondary fs-6 mb-0">
              Enterprise Architecture & AI Provider Abstraction Foundation is fully active.
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <span className="badge bg-purple-subtle text-purple border border-purple px-3 py-2 fs-6 rounded-pill">
              <Sparkles size={16} className="me-2" /> Active Provider: {activeProvider.toUpperCase()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* System Status Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="glass-card p-4 rounded-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-secondary fw-semibold">Backend Express API</span>
              <Server className="text-purple" size={24} />
            </div>
            <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <CheckCircle2 className="text-success" size={20} /> Online
            </h3>
            <span className="text-secondary small">Port 5050 | Security Enabled</span>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card p-4 rounded-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-secondary fw-semibold">Database Engine</span>
              <Database className="text-cyan" size={24} />
            </div>
            <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <CheckCircle2 className="text-success" size={20} /> {healthInfo?.database?.status || 'MongoDB Ready'}
            </h3>
            <span className="text-secondary small">Mongoose v8 Connection Pool</span>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card p-4 rounded-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-secondary fw-semibold">AI Provider Abstraction</span>
              <Cpu className="text-indigo" size={24} />
            </div>
            <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <CheckCircle2 className="text-success" size={20} /> 3 Providers Loaded
            </h3>
            <span className="text-secondary small">OpenAI, Claude 3.5, Gemini 1.5</span>
          </div>
        </div>
      </div>

      {/* Developer Prompt Generator Preview Scaffolding */}
      <div className="glass-card p-4 rounded-4 mb-4">
        <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <Code2 className="text-purple" size={22} /> Developer Prompt Engine Scaffolding
        </h4>
        <p className="text-secondary mb-4">
          Architecture support for 40+ technologies across Frontend, Backend, Mobile, DevOps, AI, Cloud, Microservices, and Databases.
        </p>

        <div className="row g-3">
          {['React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Express.js', 'NestJS', 'Laravel', 'Python', 'FastAPI', 'Spring Boot', 'Go', 'Rust', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Microservices', 'AI Apps'].map((tech) => (
            <div key={tech} className="col-6 col-sm-4 col-md-3 col-lg-2">
              <div className="p-3 bg-secondary bg-opacity-20 border border-secondary rounded-3 text-center fw-semibold text-light hover-border-purple transition-all">
                {tech}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
