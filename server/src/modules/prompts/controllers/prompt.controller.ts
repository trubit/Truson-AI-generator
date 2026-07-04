import { Request, Response, NextFunction } from 'express';
import { promptEngineService } from '../services/prompt-engine.service';

export const getPromptMetadata = async (
  _req: Request,
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
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await promptEngineService.prepareDeveloperPrompt(req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
