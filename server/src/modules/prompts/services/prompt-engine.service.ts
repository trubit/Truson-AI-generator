import { PromptCategory, PromptType, TechStackId, PromptGeneratorResult, PROMPT_CATEGORIES, TECH_STACKS } from '../../../../../shared/index';
import { logger } from '../../../config/logger.config';

export class PromptEngineService {
  /**
   * Return metadata of all supported prompt categories and tech stacks for frontend catalog
   */
  public getCategoriesMetadata() {
    return {
      categories: PROMPT_CATEGORIES,
      techStacks: TECH_STACKS,
    };
  }

  /**
   * Phase 1 Architecture Foundation Stub: Prepares metadata definition for prompt generator requests
   */
  public async prepareDeveloperPrompt(params: {
    category: PromptCategory;
    promptType: PromptType;
    techStack: TechStackId;
    requirements: string;
    architectureDetails?: string;
  }): Promise<PromptGeneratorResult> {
    logger.info(`[PromptEngineService] Preparing architecture prompt structure for ${params.category} / ${params.techStack}`);

    const systemContext = `You are a Principal Software Architect expert in ${params.techStack}. Create a production-ready, highly secure, scalable ${params.promptType} prompt for ${params.category}.`;
    
    const formattedPrompt = `${systemContext}\n\n## Task Requirements\n${params.requirements}\n\n${params.architectureDetails ? `## Architecture Details\n${params.architectureDetails}` : ''}`;

    return {
      id: `prompt_${Date.now()}`,
      category: params.category,
      promptType: params.promptType,
      techStack: params.techStack,
      generatedPrompt: formattedPrompt,
      meta: {
        recommendedModel: 'claude-3-5-sonnet-latest',
        estimatedTokens: formattedPrompt.length / 4,
        bestPractices: [
          'Follow enterprise SOLID principles',
          'Enforce strict input validation',
          'Implement proper error logging and observability',
        ],
      },
      createdAt: new Date().toISOString(),
    };
  }
}

export const promptEngineService = new PromptEngineService();
