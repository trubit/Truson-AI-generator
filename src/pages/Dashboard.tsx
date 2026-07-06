import React, { useEffect, useState } from 'react';
import { useAIStore } from '../store/ai.store';
import { useAuthStore } from '../store/auth.store';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Code2,
  FileText,
  Bot,
  ArrowRight,
  Layers,
  Terminal,
  Cpu,
  Cloud,
  Database,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui';

export const Dashboard: React.FC = () => {
  const { activeProvider, fetchProviders } = useAIStore();
  const { user } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend' | 'devops' | 'ai'>('all');

  useEffect(() => {
    fetchProviders();
  }, []);

  const categories = [
    { id: 'all', label: 'All 40+ Stacks', icon: Layers },
    { id: 'frontend', label: 'Frontend & Mobile', icon: Globe },
    { id: 'backend', label: 'Backend & APIs', icon: Terminal },
    { id: 'devops', label: 'DevOps & Cloud', icon: Cloud },
    { id: 'ai', label: 'Databases & AI', icon: Database },
  ];

  const techStacks = [
    { name: 'React', category: 'frontend', tag: 'UI' },
    { name: 'Next.js', category: 'frontend', tag: 'Framework' },
    { name: 'Vue.js', category: 'frontend', tag: 'UI' },
    { name: 'Angular', category: 'frontend', tag: 'Framework' },
    { name: 'TypeScript', category: 'frontend', tag: 'Language' },
    { name: 'React Native', category: 'frontend', tag: 'Mobile' },
    { name: 'Flutter', category: 'frontend', tag: 'Mobile' },

    { name: 'Node.js', category: 'backend', tag: 'Runtime' },
    { name: 'Express.js', category: 'backend', tag: 'API' },
    { name: 'NestJS', category: 'backend', tag: 'Framework' },
    { name: 'Python', category: 'backend', tag: 'Language' },
    { name: 'FastAPI', category: 'backend', tag: 'API' },
    { name: 'Django', category: 'backend', tag: 'Framework' },
    { name: 'Go', category: 'backend', tag: 'Language' },
    { name: 'Rust', category: 'backend', tag: 'Systems' },
    { name: 'Java Boot', category: 'backend', tag: 'Enterprise' },
    { name: 'Laravel', category: 'backend', tag: 'PHP' },

    { name: 'Docker', category: 'devops', tag: 'Container' },
    { name: 'Kubernetes', category: 'devops', tag: 'Orchestration' },
    { name: 'AWS Cloud', category: 'devops', tag: 'Cloud' },
    { name: 'Azure', category: 'devops', tag: 'Cloud' },
    { name: 'Google Cloud', category: 'devops', tag: 'Cloud' },
    { name: 'Microservices', category: 'devops', tag: 'Architecture' },
    { name: 'CI/CD Pipelines', category: 'devops', tag: 'DevOps' },

    { name: 'MongoDB', category: 'ai', tag: 'NoSQL' },
    { name: 'PostgreSQL', category: 'ai', tag: 'SQL' },
    { name: 'Redis', category: 'ai', tag: 'Cache' },
    { name: 'OpenAI GPT-4o', category: 'ai', tag: 'AI Engine' },
    { name: 'Claude 3.5', category: 'ai', tag: 'AI Engine' },
    { name: 'Gemini 1.5', category: 'ai', tag: 'AI Engine' },
  ];

  const filteredStacks =
    activeCategory === 'all' ? techStacks : techStacks.filter((s) => s.category === activeCategory);

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
            <h2 className="fw-bold mb-2" style={{ fontFamily: 'Outfit' }}>
              Welcome back, <span className="gradient-text">{user ? `${user.firstName}` : 'Architect'}</span> 👋
            </h2>
            <p className="text-secondary fs-6 mb-0">
              Enterprise AI Generator Workspaces and Provider Engines are online and ready.
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <span className="badge bg-purple-subtle text-purple border border-purple px-3 py-2 fs-6 rounded-pill">
              <Sparkles size={16} className="me-2" /> Active Engine: {activeProvider.toUpperCase()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 3 Main Action Feature Cards */}
      <div className="row g-4 mb-4">
        {/* 1. AI Chat Workspace Card */}
        <div className="col-md-4">
          <div className="glass-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between hover-border-purple">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="p-2.5 rounded-3 bg-purple bg-opacity-20 text-purple">
                  <Bot size={24} />
                </div>
                <span className="badge bg-purple-subtle text-purple border border-purple px-2.5 py-1">
                  Multi-Model
                </span>
              </div>
              <h4 className="fw-bold mb-2">AI Chat Workspace</h4>
              <p className="text-secondary small mb-3">
                Interactive multi-provider AI reasoning, architectural design, and live output streaming.
              </p>
            </div>
            <Link to="/ai-workspace" className="text-decoration-none mt-2">
              <Button variant="glow" className="w-100" size="sm" rightIcon={<ArrowRight size={16} />}>
                Launch AI Workspace
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. Coding & Dev Prompts Card */}
        <div className="col-md-4">
          <div className="glass-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between hover-border-purple">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="p-2.5 rounded-3 bg-cyan bg-opacity-20 text-cyan">
                  <Code2 size={24} />
                </div>
                <span className="badge bg-cyan-subtle text-cyan border border-cyan px-2.5 py-1">
                  40+ Stacks
                </span>
              </div>
              <h4 className="fw-bold mb-2">Dev Prompt Engine</h4>
              <p className="text-secondary small mb-3">
                Generate production-ready code prompts for React, Node, Python, Rust, DevOps & Microservices.
              </p>
            </div>
            <Link to="/prompts" className="text-decoration-none mt-2">
              <Button variant="outline" className="w-100" size="sm" rightIcon={<ArrowRight size={16} />}>
                Explore 40+ Tech Stacks
              </Button>
            </Link>
          </div>
        </div>

        {/* 3. Content Generator Card */}
        <div className="col-md-4">
          <div className="glass-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between hover-border-purple">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="p-2.5 rounded-3 bg-indigo bg-opacity-20 text-white">
                  <FileText size={24} />
                </div>
                <span className="badge bg-secondary-subtle text-secondary border border-secondary px-2.5 py-1">
                  Writing Suite
                </span>
              </div>
              <h4 className="fw-bold mb-2">Content Generator</h4>
              <p className="text-secondary small mb-3">
                Generate SEO blog articles, e-commerce product descriptions, landing copy, and email sequences.
              </p>
            </div>
            <Link to="/content" className="text-decoration-none mt-2">
              <Button variant="secondary" className="w-100" size="sm" rightIcon={<ArrowRight size={16} />}>
                Open Content Generator
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Redesigned Premium Tech Showcase (Replacing cramped column layout) */}
      <div className="glass-card p-4 rounded-4 mb-4 border border-purple-subtle">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-secondary">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <Layers className="text-purple" size={22} />
              <h4 className="fw-bold mb-0 text-light" style={{ fontFamily: 'Outfit' }}>
                Supported Engineering Stacks
              </h4>
              <span className="badge bg-purple-subtle text-purple border border-purple ms-2">
                40+ Stacks Active
              </span>
            </div>
            <p className="text-secondary small mb-0">
              Production code prompt templates for web, mobile, backend, databases, and cloud infrastructure.
            </p>
          </div>
          <Link to="/prompts" className="text-purple small text-decoration-none hover-underline fw-bold flex-shrink-0">
            Open Prompt Generator Workspace →
          </Link>
        </div>

        {/* Category Selector Tabs */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1.5 d-flex align-items-center gap-2 transition-all ${
                  isActive
                    ? 'btn-purple text-white fw-bold shadow-sm'
                    : 'btn-dark border border-secondary text-secondary hover-text-white'
                }`}
                onClick={() => setActiveCategory(cat.id as any)}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Badge Grid */}
        <div className="d-flex flex-wrap gap-2.5">
          {filteredStacks.map((stack) => (
            <Link key={stack.name} to="/prompts" className="text-decoration-none">
              <div className="px-3.5 py-2 rounded-pill bg-dark bg-opacity-80 border border-secondary text-light fw-medium d-inline-flex align-items-center gap-2 hover-border-purple shadow-sm transition-all small">
                <span className="rounded-circle bg-purple p-1 d-inline-block" style={{ width: '6px', height: '6px' }} />
                <span>{stack.name}</span>
                <span className="badge bg-body-tertiary text-secondary border border-secondary ms-1 opacity-75" style={{ fontSize: '0.7rem' }}>
                  {stack.tag}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
