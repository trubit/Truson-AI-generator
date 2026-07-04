import { AIProviderId, AIGenerateOptions, AIGenerateResult } from '../../../../../shared/index';

export interface IAIProvider {
  readonly id: AIProviderId;
  readonly name: string;

  /**
   * Generates completion using the underlying provider engine
   */
  generateCompletion(prompt: string, options?: AIGenerateOptions): Promise<AIGenerateResult>;

  /**
   * Verifies provider API key and system status
   */
  healthCheck(): Promise<boolean>;

  /**
   * Returns list of supported model IDs
   */
  getSupportedModels(): string[];
}
