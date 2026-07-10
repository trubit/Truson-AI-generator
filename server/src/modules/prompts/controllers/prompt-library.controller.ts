import { Response, NextFunction } from 'express';
import { PromptLibraryModel } from '../models/prompt-library.model';
import { AuthenticatedRequest } from '../../auth/middleware/auth.middleware';
import { AppError } from '../../../middleware/error.middleware';
import mongoose from 'mongoose';

export const saveToLibrary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { prompt, category, programmingLanguage, framework, tags } = req.body;

    if (!prompt || !category || !programmingLanguage || !framework) {
      throw new AppError('Prompt, category, programmingLanguage, and framework are required', 400);
    }

    const savedPrompt = await PromptLibraryModel.create({
      user: new mongoose.Types.ObjectId(userId),
      prompt,
      category,
      programmingLanguage,
      framework,
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      data: savedPrompt,
    });
  } catch (error) {
    next(error);
  }
};

export const listLibrary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { search, category, language, framework, tag } = req.query;
    const filter: any = { user: new mongoose.Types.ObjectId(userId) };

    if (category) {
      filter.category = category;
    }
    if (language) {
      filter.programmingLanguage = language;
    }
    if (framework) {
      filter.framework = framework;
    }
    if (tag) {
      filter.tags = tag;
    }
    if (search) {
      filter.prompt = { $regex: search, $options: 'i' };
    }

    const library = await PromptLibraryModel.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: library,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFromLibrary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) throw new AppError('Unauthorized', 401);

    const promptCard = await PromptLibraryModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!promptCard) {
      throw new AppError('Prompt card not found or unauthorized', 404);
    }

    await PromptLibraryModel.deleteOne({ _id: promptCard._id });

    res.status(200).json({
      success: true,
      message: 'Prompt card successfully deleted from library',
    });
  } catch (error) {
    next(error);
  }
};
