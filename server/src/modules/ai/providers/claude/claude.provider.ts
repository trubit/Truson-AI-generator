import Anthropic from '@anthropic-ai/sdk';
import { IAIProvider } from '../../interfaces/provider.interface';
import { AIProviderId, AIGenerateOptions, AIGenerateResult } from '../../../../../../shared/index';
import { logger } from '../../../../config/logger.config';
import { AppError } from '../../../../middleware/error.middleware';

export class ClaudeProvider implements IAIProvider {
  public readonly id: AIProviderId = 'claude';
  public readonly name = 'Anthropic Claude Provider (Claude 3.5)';

  private apiKey: string;
  private client: Anthropic | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || '';
    if (this.apiKey && !this.apiKey.includes('placeholder')) {
      this.client = new Anthropic({ apiKey: this.apiKey });
    }
  }

  public getSupportedModels(): string[] {
    return ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest'];
  }

  public async healthCheck(): Promise<boolean> {
    return Boolean(this.apiKey && !this.apiKey.includes('placeholder'));
  }

  public async generateCompletion(
    prompt: string,
    options?: AIGenerateOptions
  ): Promise<AIGenerateResult> {
    const startTime = Date.now();
    const model = options?.model || 'claude-3-5-sonnet-latest';

    logger.info(`[ClaudeProvider] Generating completion with model: ${model}`);

    if (!this.client) {
      throw new AppError(`Anthropic Claude API key is not configured.`, 400);
    }

    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: options?.maxTokens || 2048,
        system: options?.systemPrompt || 'You are Neurova, an enterprise software architecture AI generator.',
        messages: [{ role: 'user', content: prompt }],
      });

      const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
      return {
        provider: this.id,
        model,
        text,
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        },
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      logger.warn(`Anthropic Live API error: ${err.message || err}.`);
      throw err;
    }
  }
}
