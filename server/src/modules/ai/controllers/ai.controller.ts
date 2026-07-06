import { Response, NextFunction } from 'express';
import { aiRegistryService } from '../services/ai-registry.service';
import { AuthenticatedRequest } from '../../auth/middleware/auth.middleware';
import { AIGenerationHistoryModel } from '../models/ai-history.model';
import mongoose from 'mongoose';
import { AppError } from '../../../middleware/error.middleware';

export const getProvidersStatus = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const providers = await aiRegistryService.getProvidersStatus();
    res.status(200).json({
      success: true,
      activeProvider: aiRegistryService.getActiveProviderId(),
      data: providers,
    });
  } catch (error) {
    next(error);
  }
};

export const switchActiveProvider = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { providerId } = req.body;
    const provider = aiRegistryService.switchProvider(providerId);

    res.status(200).json({
      success: true,
      message: `Active AI provider successfully switched to ${provider.name}`,
      activeProvider: provider.id,
    });
  } catch (error) {
    next(error);
  }
};

export const generateAICompletion = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { prompt, providerId, model, temperature, maxTokens } = req.body;
    const userId = req.user?.userId;

    const result = await aiRegistryService.generateCompletion(prompt, {
      providerId,
      model,
      temperature,
      maxTokens,
      userId,
      category: 'AI Completion',
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle structural content generation (Blog posts, Landing copy, FAQ, technical writing, etc.)
 */
export const generateContent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, prompt, providerId, model, temperature, maxTokens } = req.body;
    const userId = req.user?.userId;

    if (!category || !prompt) {
      throw new AppError('Category and prompt parameters are required.', 400);
    }

    const systemPrompt = `You are a professional content generator and writing assistant. Produce high-quality, polished ${category} content. Adhere to professional styling and modern formatting guidelines. Do not output placeholder text.`;

    const result = await aiRegistryService.generateCompletion(prompt, {
      providerId,
      model,
      temperature,
      maxTokens,
      systemPrompt,
      userId,
      category: `Content: ${category}`,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * AI Writing Assistant (Rewrite, Expand, Summarize, Humanize, Tone, etc.)
 */
export const executeWritingAssistant = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { action, text, instructions, providerId, model, temperature, maxTokens } = req.body;
    const userId = req.user?.userId;

    if (!action || !text) {
      throw new AppError('Action and target text parameters are required.', 400);
    }

    let instructionSet = '';
    switch (action.toLowerCase()) {
      case 'rewrite':
        instructionSet = 'Rewrite the text clearly while maintaining the original semantic meaning.';
        break;
      case 'improve':
        instructionSet = 'Improve style, grammar, sentence flow, clarity, and overall reading experience.';
        break;
      case 'expand':
        instructionSet = 'Elaborate on the provided text by appending context, depth, and structural details.';
        break;
      case 'summarize':
        instructionSet = 'Provide a concise summary capturing all core arguments and conclusions.';
        break;
      case 'humanize':
        instructionSet = 'Rewrite to bypass AI patterns, introducing organic sentence complexity and vocabulary.';
        break;
      case 'tone':
        instructionSet = `Modify tone to be: ${instructions || 'Professional'}.`;
        break;
      case 'correct':
        instructionSet = 'Correct grammar, typos, punctuation, and wording. Retain all original information.';
        break;
      default:
        instructionSet = instructions || 'Improve readability and clarity.';
    }

    const systemPrompt = `You are an expert AI Writing Assistant. Follow this objective: ${instructionSet}. Return only the improved text.`;
    const prompt = `Input Text:\n"""\n${text}\n"""`;

    const result = await aiRegistryService.generateCompletion(prompt, {
      providerId,
      model,
      temperature,
      maxTokens,
      systemPrompt,
      userId,
      category: `Assistant: ${action}`,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch generation history logs for user
 */
export const getGenerationHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('Unauthorized access.', 401);
    }

    const history = await AIGenerationHistoryModel.find({
      user: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};
