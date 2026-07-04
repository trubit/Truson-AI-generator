import { IAIProvider } from '../interfaces/provider.interface';
import { AIProviderId, AIGenerateOptions, AIGenerateResult } from '../../../../../shared/index';
import { OpenAIProvider } from '../providers/openai/openai.provider';
import { ClaudeProvider } from '../providers/claude/claude.provider';
import { GeminiProvider } from '../providers/gemini/gemini.provider';
import { logger } from '../../../config/logger.config';
import { AppError } from '../../../middleware/error.middleware';

export class AIRegistryService {
  private static instance: AIRegistryService;
  private providers: Map<AIProviderId, IAIProvider> = new Map();
  private activeProviderId: AIProviderId = 'openai';

  private constructor() {
    this.initializeDefaultProviders();
  }

  public static getInstance(): AIRegistryService {
    if (!AIRegistryService.instance) {
      AIRegistryService.instance = new AIRegistryService();
    }
    return AIRegistryService.instance;
  }

  private initializeDefaultProviders(): void {
    this.registerProvider(new OpenAIProvider());
    this.registerProvider(new ClaudeProvider());
    this.registerProvider(new GeminiProvider());
  }

  /**
   * Register a new AI Provider to the registry dynamically
   */
  public registerProvider(provider: IAIProvider): void {
    this.providers.set(provider.id, provider);
    logger.info(`[AIRegistry] Registered AI Provider: ${provider.name} (${provider.id})`);
  }

  /**
   * Get an AI provider instance by ID
   */
  public getProvider(providerId?: AIProviderId): IAIProvider {
    const targetId = providerId || this.activeProviderId;
    const provider = this.providers.get(targetId);

    if (!provider) {
      throw new AppError(`AI Provider '${targetId}' is not registered.`, 404);
    }

    return provider;
  }

  /**
   * Switch active AI provider dynamically without altering business logic
   */
  public switchProvider(providerId: AIProviderId): IAIProvider {
    const provider = this.getProvider(providerId);
    this.activeProviderId = providerId;
    logger.info(`[AIRegistry] Active provider switched to: ${provider.name} (${providerId})`);
    return provider;
  }

  /**
   * Get active provider ID
   */
  public getActiveProviderId(): AIProviderId {
    return this.activeProviderId;
  }

  /**
   * Execute completion using the currently active provider or specific provider override
   */
  public async generateCompletion(
    prompt: string,
    options?: AIGenerateOptions & { providerId?: AIProviderId }
  ): Promise<AIGenerateResult> {
    const provider = this.getProvider(options?.providerId);
    return provider.generateCompletion(prompt, options);
  }

  /**
   * List metadata and status for all registered AI providers
   */
  public async getProvidersStatus(): Promise<
    Array<{ id: AIProviderId; name: string; isActive: boolean; isHealthy: boolean; models: string[] }>
  > {
    const results = [];
    for (const [id, provider] of this.providers.entries()) {
      const isHealthy = await provider.healthCheck();
      results.push({
        id,
        name: provider.name,
        isActive: id === this.activeProviderId,
        isHealthy,
        models: provider.getSupportedModels(),
      });
    }
    return results;
  }
}

export const aiRegistryService = AIRegistryService.getInstance();
