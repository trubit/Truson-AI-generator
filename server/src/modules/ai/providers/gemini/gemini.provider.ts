import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIProvider } from '../../interfaces/provider.interface';
import { AIProviderId, AIGenerateOptions, AIGenerateResult } from '../../../../../../shared/index';
import { logger } from '../../../../config/logger.config';
import { AppError } from '../../../../middleware/error.middleware';

export class GeminiProvider implements IAIProvider {
  public readonly id: AIProviderId = 'gemini';
  public readonly name = 'Google Gemini Provider (Gemini 2.5 & 2.0 Free Tier)';

  private apiKey: string;
  private genAI: GoogleGenerativeAI | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    if (this.apiKey && !this.apiKey.includes('Placeholder')) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  public getSupportedModels(): string[] {
    return ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  }

  public async healthCheck(): Promise<boolean> {
    return Boolean(this.apiKey && !this.apiKey.includes('Placeholder'));
  }

  public async generateCompletion(
    prompt: string,
    options?: AIGenerateOptions
  ): Promise<AIGenerateResult> {
    const startTime = Date.now();
    const model = options?.model || 'gemini-2.5-flash';

    logger.info(`[GeminiProvider] Generating completion with model: ${model}`);

    if (!this.genAI) {
      throw new AppError(`Google Gemini API key is not configured.`, 400);
    }

    try {
      // Append system prompt to user prompt for Gemini API models that don't have separate system role params
      const compiledPrompt = options?.systemPrompt 
        ? `${options.systemPrompt}\n\nUser Input:\n${prompt}`
        : prompt;

      const modelInstance = this.genAI.getGenerativeModel({ model });
      const result = await modelInstance.generateContent(compiledPrompt);
      const response = await result.response;
      const text = response.text();

      return {
        provider: this.id,
        model,
        text,
        usage: {
          promptTokens: prompt.length / 4,
          completionTokens: text.length / 4,
          totalTokens: (prompt.length + text.length) / 4,
        },
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      logger.warn(`Google Gemini Live API error (${model}): ${err.message || err}. Retrying with gemini-2.0-flash.`);
      try {
        const fallbackModel = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const compiledPrompt = options?.systemPrompt 
          ? `${options.systemPrompt}\n\nUser Input:\n${prompt}`
          : prompt;
        const result = await fallbackModel.generateContent(compiledPrompt);
        const response = await result.response;
        const text = response.text();

        return {
          provider: this.id,
          model: 'gemini-2.0-flash',
          text,
          usage: {
            promptTokens: prompt.length / 4,
            completionTokens: text.length / 4,
            totalTokens: (prompt.length + text.length) / 4,
          },
          latencyMs: Date.now() - startTime,
          timestamp: new Date().toISOString(),
        };
      } catch (fbErr: any) {
        logger.warn(`Gemini fallback model also failed: ${fbErr.message || fbErr}`);
        throw fbErr;
      }
    }
  }
}
