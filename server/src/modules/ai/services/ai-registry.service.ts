import { IAIProvider } from '../interfaces/provider.interface';
import { AIProviderId, AIGenerateOptions, AIGenerateResult } from '../../../../../shared/index';
import { OpenAIProvider } from '../providers/openai/openai.provider';
import { ClaudeProvider } from '../providers/claude/claude.provider';
import { GeminiProvider } from '../providers/gemini/gemini.provider';
import { logger } from '../../../config/logger.config';
import { AppError } from '../../../middleware/error.middleware';
import { AIProviderConfigModel } from '../models/provider-config.model';
import { AIGenerationHistoryModel } from '../models/ai-history.model';
import mongoose from 'mongoose';

export class AIRegistryService {
  private static instance: AIRegistryService;
  private providers: Map<AIProviderId, IAIProvider> = new Map();
  private activeProviderId: AIProviderId = 'openai';

  private constructor() {
    this.initializeDefaultProviders();
    this.syncConfigurationsWithDatabase().catch((err) => {
      logger.warn(`[AIRegistry] Failed to sync provider configs with database: ${err.message}`);
    });
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
   * Sync default providers to MongoDB AIProviderConfig database table
   */
  private async syncConfigurationsWithDatabase(): Promise<void> {
    if (mongoose.connection.readyState !== 1) {
      logger.warn('[AIRegistry] Database not connected. Skipping provider config database sync.');
      return;
    }

    const defaultConfigs: Array<{ providerName: AIProviderId; priority: number }> = [
      { providerName: 'openai', priority: 1 },
      { providerName: 'claude', priority: 2 },
      { providerName: 'gemini', priority: 3 },
    ];

    for (const config of defaultConfigs) {
      const exists = await AIProviderConfigModel.findOne({ providerName: config.providerName });
      if (!exists) {
        await AIProviderConfigModel.create({
          providerName: config.providerName,
          status: 'ENABLED',
          priority: config.priority,
          configurationMetadata: {
            maxTokensDefault: 2048,
            temperatureDefault: 0.7,
          },
        });
        logger.info(`[AIRegistry] Initialized DB config for provider: ${config.providerName}`);
      }
    }
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
   * Switch active AI provider dynamically
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
   * Generate completion with failover support
   */
  public async generateCompletion(
    prompt: string,
    options?: AIGenerateOptions & {
      providerId?: AIProviderId;
      userId?: string;
      category?: string;
    }
  ): Promise<AIGenerateResult> {
    const requestedId = options?.providerId || this.activeProviderId;
    const userId = options?.userId;
    const category = options?.category || 'AI Generation';

    // Build try-order list based on database configs and priorities
    let tryOrder: AIProviderId[] = [requestedId];
    try {
      if (mongoose.connection.readyState === 1) {
        const dbConfigs = await AIProviderConfigModel.find({ status: 'ENABLED' })
          .sort({ priority: 1 })
          .select('providerName');
        const dbOrder = dbConfigs.map((c) => c.providerName as AIProviderId);
        
        // Ensure requested provider is first in trial order, then attach the rest
        if (dbOrder.length > 0) {
          const filtered = dbOrder.filter((id) => id !== requestedId);
          tryOrder = [requestedId, ...filtered];
        }
      } else {
        // Fallback to registered provider list when database is offline
        const registeredKeys = Array.from(this.providers.keys());
        const filtered = registeredKeys.filter((id) => id !== requestedId);
        tryOrder = [requestedId, ...filtered];
      }
    } catch (err) {
      logger.warn(`[AIRegistry] Failed to fetch priorities from database, using static fallback: ${err}`);
      // Standard static backup path
      const backupOrder: AIProviderId[] = ['openai', 'claude', 'gemini'];
      tryOrder = [requestedId, ...backupOrder.filter((id) => id !== requestedId)];
    }

    let lastError: Error | null = null;
    const startTime = Date.now();

    for (const providerId of tryOrder) {
      try {
        const provider = this.getProvider(providerId);
        logger.info(`[AIRegistry] Attempting completion using provider: ${provider.name} (${providerId})`);
        
        const result = await provider.generateCompletion(prompt, options);

        // Record execution history log asynchronously
        this.logGenerationHistory({
          userId,
          providerId,
          category,
          prompt,
          options,
          responseText: result.text,
          latency: Date.now() - startTime,
          status: 'SUCCESS',
          usage: result.usage,
        }).catch((err) => logger.error(`[AIRegistry] Failed to save history log: ${err.message}`));

        return result;
      } catch (err: any) {
        logger.warn(`[AIRegistry] Provider ${providerId} failed: ${err.message || err}. Attempting failover.`);
        lastError = err;
      }
    }

    // If all providers in loop failed, log the failure event
    this.logGenerationHistory({
      userId,
      providerId: requestedId,
      category,
      prompt,
      options,
      responseText: `FAILOVER ERROR: All AI Providers failed. Last error: ${lastError?.message}`,
      latency: Date.now() - startTime,
      status: 'FAILED',
    }).catch((err) => logger.error(`[AIRegistry] Failed to save error history log: ${err.message}`));

    // If we are in development mode, return a mock response to ensure local testing works seamlessly
    if (process.env.NODE_ENV === 'development') {
      logger.warn(`[AIRegistry] All live AI providers failed or are out of quota. Falling back to mock completion in non-production mode.`);
      const mockText = `## Mock Generation Fallback

All live AI providers failed (last error: ${lastError?.message || 'quota exceeded'}). Returning development mock response.

### Generated Text Outline
1. **Introduction**: A high-quality placeholder section.
2. **Analysis**: Under development configuration.
3. **Conclusion**: Replace with valid keys in \`.env\`.

*Generated at: ${new Date().toISOString()}*`;

      return {
        provider: 'openai',
        model: 'dev-fallback-mock',
        text: mockText,
        usage: {
          promptTokens: 120,
          completionTokens: 250,
          totalTokens: 370,
        },
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }

    throw new AppError(
      `AI Engine failover exhausted. All providers failed. Last error: ${lastError?.message || 'unknown'}`,
      503
    );
  }

  /**
   * Save execution outcome into database
   */
  private async logGenerationHistory(params: {
    userId?: string;
    providerId: AIProviderId;
    category: string;
    prompt: string;
    options?: AIGenerateOptions;
    responseText: string;
    latency: number;
    status: 'SUCCESS' | 'FAILED';
    usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
  }): Promise<void> {
    if (!params.userId || mongoose.connection.readyState !== 1) {
      return;
    }

    try {
      await AIGenerationHistoryModel.create({
        user: new mongoose.Types.ObjectId(params.userId),
        provider: params.providerId,
        category: params.category,
        request: {
          prompt: params.prompt,
          model: params.options?.model,
          temperature: params.options?.temperature,
          maxTokens: params.options?.maxTokens,
          systemPrompt: params.options?.systemPrompt,
        },
        response: {
          text: params.responseText,
          modelUsed: params.options?.model || params.providerId,
        },
        tokenUsage: params.usage || {
          promptTokens: Math.ceil(params.prompt.length / 4),
          completionTokens: Math.ceil(params.responseText.length / 4),
          totalTokens: Math.ceil((params.prompt.length + params.responseText.length) / 4),
        },
        processingTime: params.latency,
        status: params.status,
      });
    } catch (err: any) {
      logger.error(`[AIRegistry] Error writing to AIGenerationHistoryModel: ${err.message}`);
    }
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
