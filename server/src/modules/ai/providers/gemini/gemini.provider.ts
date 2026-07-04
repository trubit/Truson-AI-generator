import { IAIProvider } from '../../interfaces/provider.interface';
import { AIProviderId, AIGenerateOptions, AIGenerateResult } from '../../../../../../shared/index';
import { logger } from '../../../../config/logger.config';

export class GeminiProvider implements IAIProvider {
  public readonly id: AIProviderId = 'gemini';
  public readonly name = 'Google Gemini Provider (Gemini 1.5)';

  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
  }

  public getSupportedModels(): string[] {
    return ['gemini-1.5-pro', 'gemini-1.5-flash'];
  }

  public async healthCheck(): Promise<boolean> {
    try {
      return Boolean(this.apiKey && this.apiKey !== 'AIzaSyPlaceholderGeminiKey');
    } catch (error) {
      logger.error(`Gemini Health Check Failed: ${error}`);
      return false;
    }
  }

  public async generateCompletion(
    prompt: string,
    options?: AIGenerateOptions
  ): Promise<AIGenerateResult> {
    const startTime = Date.now();
    const model = options?.model || 'gemini-1.5-flash';

    logger.info(`[GeminiProvider] Generating completion with model: ${model}`);

    const mockOutput = `[Gemini ${model} Generated Output]\n\nPrompt received:\n${prompt.slice(0, 100)}...`;

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
