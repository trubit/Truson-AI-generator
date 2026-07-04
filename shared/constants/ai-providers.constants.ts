import { AIProviderInfo } from '../types/ai.types';

export const SUPPORTED_AI_PROVIDERS: AIProviderInfo[] = [
  {
    id: 'openai',
    name: 'OpenAI GPT-4o',
    description: 'Industry leading general intelligence and code generation capabilities.',
    isAvailable: true,
    models: ['gpt-4o', 'gpt-4o-mini', 'o1-mini'],
  },
  {
    id: 'claude',
    name: 'Anthropic Claude 3.5 Sonnet',
    description: 'State-of-the-art reasoning, code analysis, and long context support.',
    isAvailable: true,
    models: ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest'],
  },
  {
    id: 'gemini',
    name: 'Google Gemini 1.5 Pro',
    description: 'Multimodal AI with massive context window and strong architectural reasoning.',
    isAvailable: true,
    models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
  },
];

export const DEFAULT_AI_PROVIDER_ID = 'openai';
