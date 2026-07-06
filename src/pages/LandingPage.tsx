import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Code2,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Layers,
  Terminal,
  Database,
  Cloud,
} from 'lucide-react';
import { Button, Card, Badge, Accordion } from '../components/ui';
import { slideUp, staggerContainer } from '../utils/animations';

export const LandingPage: React.FC = () => {
  const faqItems = [
    {
      id: 'faq-1',
      header: 'What is Truson-AI-Generator?',
      content:
        'Truson-AI-Generator is a premium enterprise AI platform engineered for full-stack developers, software architects, and content engineering teams to generate high-precision code prompts, architecture specs, and marketing copy.',
    },
    {
      id: 'faq-2',
      header: 'Which AI providers are supported?',
      content:
        'Truson includes a zero-coupling AI Provider Abstraction Layer supporting OpenAI (GPT-4o), Anthropic Claude (Claude 3.5 Sonnet), and Google Gemini (Gemini 1.5 Pro).',
    },
    {
      id: 'faq-3',
      header: 'Does it support prompt generation for 40+ technologies?',
      content:
        'Yes! The prompt engine supports Frontend, Backend, Mobile, Databases, DevOps, Microservices, Security, APIs, Cloud (AWS/Azure/GCP), and AI Application engineering.',
    },
    {
      id: 'faq-4',
      header: 'Is Paystack payment supported?',
      content:
        'Yes, Truson-AI-Generator is fully configured with Paystack billing and subscription management.',
    },
  ];

  return (
    <div className="bg-dark text-light overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="py-5 text-center position-relative overflow-hidden min-vh-75 d-flex align-items-center">
        <div className="container px-4">
          <motion.div initial="hidden" animate="visible" variants={slideUp}>
            <Badge variant="purple" className="mb-3 px-3 py-1.5 fs-7">
              <Sparkles size={14} className="me-1" /> Next-Gen Enterprise AI Engine
            </Badge>

            <h1 className="display-3 fw-bold mb-3">
              Generate Enterprise <span className="gradient-text">Prompts & Code</span> Effortlessly
            </h1>

            <p className="lead text-secondary max-w-2xl mx-auto mb-4">
              Architect, refactor, and generate production-ready code prompts for 40+ technologies across React, Node.js, Python, Rust, Go, DevOps, and Microservices.
            </p>

            <div className="d-flex align-items-center justify-content-center gap-3">
              <Link to="/ai-workspace">
                <Button variant="glow" size="lg" rightIcon={<ArrowRight size={20} />}>
                  Launch AI Workspace
                </Button>
              </Link>
              <Link to="/prompts">
                <Button variant="outline" size="lg" leftIcon={<Code2 size={20} />}>
                  Explore 40+ Tech Prompts
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. AI CAPABILITIES SECTION */}
      <section className="py-5 bg-body-tertiary border-top border-bottom border-secondary">
        <div className="container px-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6">
              Multi-Engine <span className="gradient-text">AI Abstraction</span>
            </h2>
            <p className="text-secondary">Switch seamlessly between top AI models without modifying application logic.</p>
          </div>

          <div className="row g-4">
            {[
              { title: 'OpenAI GPT-4o', desc: 'Industry leading code generation and reasoning engine.', icon: Zap },
              { title: 'Anthropic Claude 3.5', desc: 'State of the art architectural analysis and deep debugging.', icon: Cpu },
              { title: 'Google Gemini 1.5', desc: 'Massive context window for full-stack codebase evaluation.', icon: Sparkles },
            ].map((item) => (
              <div key={item.title} className="col-md-4">
                <Card className="h-100">
                  <div className="p-3 rounded-3 bg-purple bg-opacity-20 text-purple d-inline-block mb-3">
                    <item.icon size={28} />
                  </div>
                  <h4 className="fw-bold mb-2">{item.title}</h4>
                  <p className="text-secondary small mb-0">{item.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROMPT GENERATOR OVERVIEW */}
      <section className="py-5">
        <div className="container px-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6">
              Developer <span className="gradient-text">Prompt Engine</span>
            </h2>
            <p className="text-secondary">Tailored prompt templates for 40+ languages, frameworks, and infrastructure areas.</p>
          </div>

          <div className="row g-3">
            {[
              { name: 'React & Next.js', icon: Code2 },
              { name: 'Node.js & NestJS', icon: Terminal },
              { name: 'Python & FastAPI', icon: Cpu },
              { name: 'Go & Rust', icon: Zap },
              { name: 'MongoDB & PostgreSQL', icon: Database },
              { name: 'Docker & Kubernetes', icon: Cloud },
            ].map((stack) => (
              <div key={stack.name} className="col-md-4 col-sm-6">
                <Card className="d-flex align-items-center gap-3 p-3">
                  <stack.icon className="text-cyan" size={24} />
                  <span className="fw-semibold text-light">{stack.name}</span>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE TRUSON-AI */}
      <section className="py-5 bg-body-tertiary border-top border-secondary">
        <div className="container px-4">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="fw-bold display-6 mb-3">
                Why Choose <span className="gradient-text">Truson-AI-Generator</span>?
              </h2>
              <p className="text-secondary mb-4">
                Built from the ground up for software architects requiring strict zero-coupling provider registries, Paystack payment support, and Zod-validated configurations.
              </p>
              <ul className="list-unstyled d-flex flex-column gap-3 text-light">
                <li className="d-flex align-items-center gap-2">
                  <CheckCircle2 className="text-success" size={20} /> Zero hardcoded credentials or API keys.
                </li>
                <li className="d-flex align-items-center gap-2">
                  <CheckCircle2 className="text-success" size={20} /> Helmet, CORS, and Express Rate-Limiting active.
                </li>
                <li className="d-flex align-items-center gap-2">
                  <CheckCircle2 className="text-success" size={20} /> Multi-stage Docker & GitHub Actions CI/CD ready.
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <Card className="p-4 border-purple">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <ShieldCheck size={32} className="text-purple" />
                  <h4 className="fw-bold mb-0">Enterprise Foundation Ready</h4>
                </div>
                <p className="text-secondary small mb-0">
                  Truson-AI provides a fully responsive UI/UX system, light/dark theme persistence, and modular workspace components.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING PREVIEW */}
      <section className="py-5">
        <div className="container px-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-secondary">Powered by Paystack subscription integration.</p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-md-5 col-lg-4">
              <Card className="h-100 border-purple position-relative">
                <Badge variant="purple" className="position-absolute top-0 end-0 m-3">
                  Popular
                </Badge>
                <h3 className="fw-bold mb-2">Enterprise Plan</h3>
                <div className="display-5 fw-bold gradient-text mb-3">$49 <span className="fs-6 text-secondary">/ month</span></div>
                <p className="text-secondary small mb-4">Full access to OpenAI, Claude 3.5, Gemini 1.5, and 40+ prompt generators.</p>
                <Link to="/ai-workspace" className="w-100">
                  <Button variant="glow" className="w-100">
                    Get Started Free
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-5 bg-body-tertiary border-top border-secondary">
        <div className="container px-4 max-w-3xl">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>

          <Accordion items={faqItems} defaultActiveKey="faq-1" />
        </div>
      </section>
    </div>
  );
};
