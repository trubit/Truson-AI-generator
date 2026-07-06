import { PromptCategory, PromptType, TechStackId, PromptGeneratorResult, PROMPT_CATEGORIES, TECH_STACKS } from '../../../../../shared/index';
import { logger } from '../../../config/logger.config';
import { getTemplateForRequest } from '../templates/templates';
import { PromptHistoryModel, IPromptHistoryDocument } from '../models/prompt-history.model';
import mongoose from 'mongoose';
import { AppError } from '../../../middleware/error.middleware';

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
   * Compiles prompt templates, injecting parameters and saving history
   */
  public async prepareDeveloperPrompt(params: {
    category: PromptCategory;
    promptType: PromptType;
    techStack: TechStackId;
    requirements: string;
    architectureDetails?: string;
    userId?: string;
  }): Promise<PromptGeneratorResult> {
    logger.info(`[PromptEngineService] Compiling prompt for ${params.category} using tech: ${params.techStack}`);

    const template = getTemplateForRequest(params.category, params.promptType, params.techStack);
    
    // Perform parameter interpolation
    let generatedPrompt = template.templateText
      .replace(/{requirements}/g, params.requirements)
      .replace(/{architectureDetails}/g, params.architectureDetails || 'N/A')
      .replace(/{category}/g, params.category)
      .replace(/{promptType}/g, params.promptType)
      .replace(/{techStack}/g, params.techStack)
      .replace(/{language}/g, params.techStack === 'typescript' || params.techStack === 'javascript' ? 'TypeScript' : params.techStack);

    // Save prompt to database history if user context is provided
    let promptId = `prompt_${Date.now()}`;
    if (params.userId && mongoose.connection.readyState === 1) {
      try {
        const historyDoc = await PromptHistoryModel.create({
          user: new mongoose.Types.ObjectId(params.userId),
          promptCategory: params.category,
          programmingLanguage: params.techStack,
          framework: params.architectureDetails || 'Generic',
          promptType: params.promptType,
          generatedPrompt,
          favoriteStatus: false,
        });
        promptId = historyDoc._id.toString();
        logger.info(`[PromptEngineService] Saved prompt history log. ID: ${promptId}`);
      } catch (err: any) {
        logger.error(`[PromptEngineService] Error saving history log: ${err.message}`);
      }
    }

    return {
      id: promptId,
      category: params.category,
      promptType: params.promptType,
      techStack: params.techStack,
      generatedPrompt,
      meta: {
        recommendedModel: 'claude-3-5-sonnet-latest',
        estimatedTokens: Math.ceil(generatedPrompt.length / 4),
        bestPractices: [
          'Adhere to enterprise SOLID principles',
          'Enforce strict input validation schemas (e.g. Zod)',
          'Ensure robust error boundaries, structured logging, and operational observability',
        ],
      },
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Fetch generated prompts history for user
   */
  public async getHistory(userId: string): Promise<IPromptHistoryDocument[]> {
    if (mongoose.connection.readyState !== 1) {
      return [];
    }
    return PromptHistoryModel.find({ user: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  /**
   * Toggle favorite status of a prompt history entry
   */
  public async toggleFavorite(promptHistoryId: string, userId: string): Promise<IPromptHistoryDocument> {
    if (mongoose.connection.readyState !== 1) {
      throw new AppError('Database connection offline', 503);
    }

    const prompt = await PromptHistoryModel.findOne({
      _id: new mongoose.Types.ObjectId(promptHistoryId),
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!prompt) {
      throw new AppError('Prompt history entry not found or unauthorized', 404);
    }

    prompt.favoriteStatus = !prompt.favoriteStatus;
    await prompt.save();
    
    logger.info(`[PromptEngineService] Toggled favorite status for prompt: ${promptHistoryId} to ${prompt.favoriteStatus}`);
    return prompt;
  }
}

export const promptEngineService = new PromptEngineService();
