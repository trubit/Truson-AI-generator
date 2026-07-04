import React from 'react';
import { FileText, Sparkles, Edit3, Type, CheckCircle } from 'lucide-react';

export const ContentGenPage: React.FC = () => {
  const contentTypes = [
    { title: 'Blog Posts', desc: 'Long-form SEO optimized blog articles' },
    { title: 'Product Descriptions', desc: 'High-converting e-commerce copy' },
    { title: 'SEO Content', desc: 'Keyword targeted content outlines' },
    { title: 'Marketing Content', desc: 'Ad copy, banners, and value propositions' },
    { title: 'Social Media Content', desc: 'LinkedIn, Twitter/X, and Instagram posts' },
    { title: 'Landing Page Content', desc: 'Hero section, features, and FAQs' },
    { title: 'Email Content', desc: 'Cold emails, newsletters, and sequences' },
    { title: 'AI Writing Assistant', desc: 'Rewrite, expand, summarize, humanize, tone adjustment' },
  ];

  return (
    <div className="container-fluid px-0">
      <div className="mb-4">
        <h2 className="fw-bold d-flex align-items-center gap-2">
          <FileText className="text-cyan" /> Content Generation Engine
        </h2>
        <p className="text-secondary">
          Phase 1 Architecture Foundation prepared for multi-channel content creation and writing assistant features.
        </p>
      </div>

      <div className="row g-4">
        {contentTypes.map((type) => (
          <div key={type.title} className="col-md-6 col-lg-4">
            <div className="glass-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h5 className="fw-bold mb-0">{type.title}</h5>
                  <Sparkles size={18} className="text-cyan" />
                </div>
                <p className="text-secondary small mb-3">{type.desc}</p>
              </div>
              <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary">
                <span className="badge bg-cyan-subtle text-cyan border border-cyan px-2 py-1 small">
                  <CheckCircle size={12} className="me-1" /> Foundation Scaffolding Active
                </span>
                <span className="text-secondary small">Phase 2</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
