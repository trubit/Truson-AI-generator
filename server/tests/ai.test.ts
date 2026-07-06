import { AIRegistryService } from '../src/modules/ai/services/ai-registry.service';
import { IAIProvider } from '../src/modules/ai/interfaces/provider.interface';
import { AIProviderId, AIGenerateOptions, AIGenerateResult } from '../../shared/index';

class MockAIProvider implements IAIProvider {
  public id: AIProviderId;
  public name: string;
  public failCount = 0;
  public maxFailBeforeSuccess = 0;

  constructor(id: AIProviderId, name: string, maxFailBeforeSuccess = 0) {
    this.id = id;
    this.name = name;
    this.maxFailBeforeSuccess = maxFailBeforeSuccess;
  }

  public getSupportedModels(): string[] {
    return ['mock-model'];
  }

  public async healthCheck(): Promise<boolean> {
    return true;
  }

  public async generateCompletion(prompt: string, options?: AIGenerateOptions): Promise<AIGenerateResult> {
    if (this.failCount < this.maxFailBeforeSuccess) {
      this.failCount++;
      throw new Error(`Mock provider ${this.id} failed intentionally`);
    }
    return {
      provider: this.id,
      model: options?.model || 'mock-model',
      text: `Mocked output for prompt: ${prompt}`,
      latencyMs: 10,
      timestamp: new Date().toISOString(),
    };
  }
}

describe('AI Provider Manager & Failover Logic Tests', () => {
  let registry: AIRegistryService;

  beforeEach(() => {
    registry = AIRegistryService.getInstance();
  });

  it('should register and retrieve providers correctly', () => {
    const mockOpenAI = new MockAIProvider('openai', 'Mock OpenAI');
    registry.registerProvider(mockOpenAI);

    const provider = registry.getProvider('openai');
    expect(provider.id).toBe('openai');
    expect(provider.name).toBe('Mock OpenAI');
  });

  it('should fallback to secondary provider when primary fails', async () => {
    const failingOpenAI = new MockAIProvider('openai', 'Failing OpenAI', 1);
    const successfulClaude = new MockAIProvider('claude', 'Successful Claude', 0);
    
    registry.registerProvider(failingOpenAI);
    registry.registerProvider(successfulClaude);

    // Call generateCompletion. It should fall back automatically
    const result = await registry.generateCompletion('Generate test architecture code', {
      providerId: 'openai',
    });

    expect(result.provider).toBe('claude');
    expect(result.text).toContain('Mocked output for prompt');
  });

  it('should throw an error if all providers in chain fail', async () => {
    const failingOpenAI = new MockAIProvider('openai', 'Failing OpenAI', 99);
    const failingClaude = new MockAIProvider('claude', 'Failing Claude', 99);
    const failingGemini = new MockAIProvider('gemini', 'Failing Gemini', 99);

    registry.registerProvider(failingOpenAI);
    registry.registerProvider(failingClaude);
    registry.registerProvider(failingGemini);

    await expect(
      registry.generateCompletion('Generate failing code', { providerId: 'openai' })
    ).rejects.toThrow('AI Engine failover exhausted');
  });
});
