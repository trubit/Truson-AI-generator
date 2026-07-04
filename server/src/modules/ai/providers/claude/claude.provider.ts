import { IAIProvider } from '../../interfaces/provider.interface';
import { AIProviderId, AIGenerateOptions, AIGenerateResult } from '../../../../../../shared/index';
import { logger } from '../../../../config/logger.config';

export class ClaudeProvider implements IAIProvider {
  public readonly id: AIProviderId = 'claude';
  public readonly name = 'Anthropic Claude Provider (Claude 3.5)';

  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || '';
  }

  public getSupportedModels(): string[] {
    return ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest'];
  }

  public async healthCheck(): Promise<boolean> {
    try {
      return Boolean(this.apiKey && this.apiKey !== 'sk-ant-placeholder-anthropic-api-key');
    } catch (error) {
      logger.error(`Claude Health Check Failed: ${error}`);
      return false;
    }
  }

  public async generateCompletion(
    prompt: string,
    options?: AIGenerateOptions
  ): Promise<AIGenerateResult> {
    const startTime = Date.now();
    const model = options?.model || 'claude-3-5-sonnet-latest';

    logger.info(`[ClaudeProvider] Generating completion with model: ${model}`);

    const mockOutput = `[Claude ${model} Generated Output]\n\nPrompt received:\n${prompt.slice(0, 100)}...`;

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
