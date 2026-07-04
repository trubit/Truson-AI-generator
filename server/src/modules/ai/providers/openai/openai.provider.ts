import { IAIProvider } from '../../interfaces/provider.interface';
import { AIProviderId, AIGenerateOptions, AIGenerateResult } from '../../../../../../shared/index';
import { logger } from '../../../../config/logger.config';

export class OpenAIProvider implements IAIProvider {
  public readonly id: AIProviderId = 'openai';
  public readonly name = 'OpenAI Provider (GPT-4o)';

  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
  }

  public getSupportedModels(): string[] {
    return ['gpt-4o', 'gpt-4o-mini', 'o1-mini'];
  }

  public async healthCheck(): Promise<boolean> {
    try {
      return Boolean(this.apiKey && this.apiKey !== 'sk-placeholder-openai-api-key');
    } catch (error) {
      logger.error(`OpenAI Health Check Failed: ${error}`);
      return false;
    }
  }

  public async generateCompletion(
    prompt: string,
    options?: AIGenerateOptions
  ): Promise<AIGenerateResult> {
    const startTime = Date.now();
    const model = options?.model || 'gpt-4o-mini';

    logger.info(`[OpenAIProvider] Generating completion with model: ${model}`);

    const mockOutput = `[OpenAI ${model} Generated Output]\n\nPrompt received:\n${prompt.slice(0, 100)}...`;

    return {
      provider: this.id,
      model,
      text: mockOutput,
      usage: {
        promptTokens: prompt.length / 4,
        completionTokens: mockOutput.length / 4,
        totalTokens: (prompt.length + mockOutput.length) / 4,
      },
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }
}
