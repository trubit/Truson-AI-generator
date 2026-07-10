import OpenAI from 'openai';
import { IAIProvider } from '../../interfaces/provider.interface';
import { AIProviderId, AIGenerateOptions, AIGenerateResult } from '../../../../../../shared/index';
import { logger } from '../../../../config/logger.config';
import { AppError } from '../../../../middleware/error.middleware';

export class OpenAIProvider implements IAIProvider {
  public readonly id: AIProviderId = 'openai';
  public readonly name = 'OpenAI Provider (GPT-4o)';

  private apiKey: string;
  private client: OpenAI | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    if (this.apiKey && !this.apiKey.includes('placeholder')) {
      this.client = new OpenAI({ apiKey: this.apiKey });
    }
  }

  public getSupportedModels(): string[] {
    return ['gpt-4o', 'gpt-4o-mini', 'o1-mini'];
  }

  public async healthCheck(): Promise<boolean> {
    return Boolean(this.apiKey && !this.apiKey.includes('placeholder'));
  }

  public async generateCompletion(
    prompt: string,
    options?: AIGenerateOptions
  ): Promise<AIGenerateResult> {
    const startTime = Date.now();
    const model = options?.model || 'gpt-4o-mini';

    logger.info(`[OpenAIProvider] Generating completion with model: ${model}`);

    if (!this.client) {
      throw new AppError(`OpenAI API key is not configured.`, 400);
    }

    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: options?.systemPrompt || 'You are Neurova, an enterprise software architecture AI generator.' },
          { role: 'user', content: prompt },
        ],
        temperature: options?.temperature !== undefined ? options.temperature : 0.7,
        max_tokens: options?.maxTokens || 2048,
      });

      const text = response.choices[0]?.message?.content || '';
      return {
        provider: this.id,
        model,
        text,
        usage: {
          promptTokens: response.usage?.prompt_tokens || prompt.length / 4,
          completionTokens: response.usage?.completion_tokens || text.length / 4,
          totalTokens: response.usage?.total_tokens || (prompt.length + text.length) / 4,
        },
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      logger.warn(`OpenAI Live API error: ${err.message || err}.`);
      throw err;
    }
  }
}
