import { Request, Response, NextFunction } from 'express';
import { aiRegistryService } from '../services/ai-registry.service';
import { AIProviderId } from '../../../../../shared/index';

export const getProvidersStatus = async (
  _req: Request,
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
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { providerId } = req.body as { providerId: AIProviderId };
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
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { prompt, providerId, model, temperature, maxTokens } = req.body;

    const result = await aiRegistryService.generateCompletion(prompt, {
      providerId,
      model,
      temperature,
      maxTokens,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
