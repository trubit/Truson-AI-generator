import React from 'react';
import { Layers } from 'lucide-react';

export const PROGRAMMING_LANGUAGES = [
  'TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'PHP', 'Go', 'Rust', 'Dart', 'Kotlin', 'Swift', 'Ruby'
];

export const FRAMEWORKS = [
  'React', 'Next.js', 'Vue', 'Angular', 'Express', 'NestJS', 'Django', 'Flask', 'Laravel', 'Spring Boot', 'ASP.NET', 'FastAPI'
];

export const DEVELOPMENT_AREAS = [
  'Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps', 'Cloud', 'AI', 'APIs', 'Databases', 'Microservices', 'Testing', 'Security'
];

export interface PromptCategorySelectorProps {
  selectedLanguage: string;
  selectedFramework: string;
  selectedArea: string;
  onLanguageChange: (lang: string) => void;
  onFrameworkChange: (fw: string) => void;
  onAreaChange: (area: string) => void;
}

export const PromptCategorySelector: React.FC<PromptCategorySelectorProps> = ({
  selectedLanguage,
  selectedFramework,
  selectedArea,
  onLanguageChange,
  onFrameworkChange,
  onAreaChange,
}) => {
  return (
    <div className="glass-card p-4 rounded-4 mb-4">
      <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <Layers className="text-purple" size={20} /> Technology & Category Selector
      </h5>

      {/* Development Area */}
      <div className="mb-3">
        <label className="form-label text-secondary small fw-semibold">Development Area</label>
        <div className="d-flex flex-wrap gap-2">
          {DEVELOPMENT_AREAS.map((area) => (
            <button
              key={area}
              type="button"
              className={`btn btn-sm rounded-pill ${
                selectedArea === area ? 'btn-purple text-white fw-bold' : 'btn-outline-secondary text-light'
              }`}
              onClick={() => onAreaChange(area)}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Programming Languages */}
      <div className="mb-3">
        <label className="form-label text-secondary small fw-semibold">Programming Language</label>
        <div className="d-flex flex-wrap gap-2">
          {PROGRAMMING_LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              className={`btn btn-sm rounded-pill ${
                selectedLanguage === lang ? 'btn-cyan text-dark fw-bold' : 'btn-outline-secondary text-light'
              }`}
              onClick={() => onLanguageChange(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Frameworks */}
      <div>
        <label className="form-label text-secondary small fw-semibold">Framework</label>
        <div className="d-flex flex-wrap gap-2">
          {FRAMEWORKS.map((fw) => (
            <button
              key={fw}
              type="button"
              className={`btn btn-sm rounded-pill ${
                selectedFramework === fw ? 'bg-indigo text-white fw-bold' : 'btn-outline-secondary text-light'
              }`}
              onClick={() => onFrameworkChange(fw)}
            >
              {fw}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
