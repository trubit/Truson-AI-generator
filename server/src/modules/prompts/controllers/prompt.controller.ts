import { Response, NextFunction } from 'express';
import { promptEngineService } from '../services/prompt-engine.service';
import { AuthenticatedRequest } from '../../auth/middleware/auth.middleware';
import { AppError } from '../../../middleware/error.middleware';

export const getPromptMetadata = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const metadata = promptEngineService.getCategoriesMetadata();
    res.status(200).json({
      success: true,
      data: metadata,
    });
  } catch (error) {
    next(error);
  }
};

export const preparePrompt = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, promptType, techStack, requirements, architectureDetails } = req.body;
    const userId = req.user?.userId;

    if (!category || !promptType || !techStack || !requirements) {
      throw new AppError('Category, promptType, techStack, and requirements are required.', 400);
    }

    const result = await promptEngineService.prepareDeveloperPrompt({
      category,
      promptType,
      techStack,
      requirements,
      architectureDetails,
      userId,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPromptHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('Unauthorized access.', 401);
    }

    const history = await promptEngineService.getHistory(userId);
    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFavoritePrompt = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      throw new AppError('Unauthorized access.', 401);
    }

    const updatedPrompt = await promptEngineService.toggleFavorite(id, userId);

    res.status(200).json({
      success: true,
      data: updatedPrompt,
    });
  } catch (error) {
    next(error);
  }
};
