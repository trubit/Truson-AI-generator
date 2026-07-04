export type AIProviderId = 'openai' | 'claude' | 'gemini';

export interface AIModelConfig {
  id: string;
  name: string;
  maxTokens: number;
  temperature: number;
}

export interface AIProviderInfo {
  id: AIProviderId;
  name: string;
  description: string;
  isAvailable: boolean;
  models: string[];
}

export interface AIGenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  topP?: number;
}

export interface AIGenerateResult {
  provider: AIProviderId;
  model: string;
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
  timestamp: string;
}
