export type PromptCategory =
  | 'Frontend'
  | 'Backend'
  | 'Mobile'
  | 'Database'
  | 'DevOps'
  | 'Cloud'
  | 'AI'
  | 'Security'
  | 'Testing'
  | 'Architecture'
  | 'Microservices';

export type PromptType =
  | 'Coding'
  | 'Architecture'
  | 'Debugging'
  | 'Refactoring'
  | 'Security Review'
  | 'Code Review'
  | 'API Development'
  | 'Database Design'
  | 'Deployment'
  | 'SaaS Development'
  | 'Mobile App'
  | 'Enterprise System';

export type TechStackId =
  | 'react'
  | 'nextjs'
  | 'vue'
  | 'angular'
  | 'nodejs'
  | 'express'
  | 'nestjs'
  | 'laravel'
  | 'php'
  | 'python'
  | 'django'
  | 'flask'
  | 'fastapi'
  | 'java'
  | 'springboot'
  | 'kotlin'
  | 'swift'
  | 'react-native'
  | 'flutter'
  | 'dart'
  | 'typescript'
  | 'javascript'
  | 'go'
  | 'rust'
  | 'csharp'
  | 'aspnet'
  | 'ruby-on-rails'
  | 'mongodb'
  | 'postgresql'
  | 'mysql'
  | 'redis'
  | 'docker'
  | 'kubernetes'
  | 'aws'
  | 'azure'
  | 'gcp'
  | 'devops'
  | 'cicd'
  | 'microservices'
  | 'ai-apps';

export interface PromptTemplateDefinition {
  id: string;
  title: string;
  category: PromptCategory;
  promptType: PromptType;
  techStack: TechStackId[];
  description: string;
  systemRole: string;
  templateText: string;
  variables: string[];
}

export interface GeneratePromptRequest {
  category: PromptCategory;
  promptType: PromptType;
  techStack: TechStackId;
  requirements: string;
  architectureDetails?: string;
  outputFormat?: 'markdown' | 'json' | 'structured';
}

export interface PromptGeneratorResult {
  id: string;
  category: PromptCategory;
  promptType: PromptType;
  techStack: TechStackId;
  generatedPrompt: string;
  meta: {
    recommendedModel: string;
    estimatedTokens: number;
    bestPractices: string[];
  };
  createdAt: string;
}
