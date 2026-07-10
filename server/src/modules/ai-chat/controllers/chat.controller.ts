import { Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service';
import { AuthenticatedRequest } from '../../auth/middleware/auth.middleware';
import { AppError } from '../../../middleware/error.middleware';

export const createConversation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { title, provider, category } = req.body;
    const conversation = await chatService.createConversation(userId, { title, provider, category });

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const listConversations = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { search, provider, category, status, isFavorite } = req.query;

    const conversations = await chatService.listConversations(userId, {
      search: search as string,
      provider: provider as string,
      category: category as string,
      status: status as 'active' | 'archived',
      isFavorite: isFavorite === 'true' ? true : isFavorite === 'false' ? false : undefined,
    });

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

export const updateConversation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) throw new AppError('Unauthorized', 401);

    const conversation = await chatService.updateConversation(userId, id, req.body);

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) throw new AppError('Unauthorized', 401);

    await chatService.deleteConversation(userId, id);

    res.status(200).json({
      success: true,
      message: 'Conversation and all its messages successfully deleted',
    });
  } catch (error) {
    next(error);
  }
};

export const listMessages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { limit, before } = req.query;

    const messages = await chatService.listMessages(userId, id, {
      limit: limit ? parseInt(limit as string, 10) : undefined,
      before: before as string,
    });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { content, retryMessageId, regenerate } = req.body;

    const result = await chatService.sendMessage(userId, id, {
      content,
      retryMessageId,
      regenerate,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id, msgId } = req.params;
    if (!userId) throw new AppError('Unauthorized', 401);

    await chatService.deleteMessage(userId, id, msgId);

    res.status(200).json({
      success: true,
      message: 'Message successfully deleted',
    });
  } catch (error) {
    next(error);
  }
};

export const exportConversation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { format } = req.body;

    if (!userId) throw new AppError('Unauthorized', 401);
    if (!format) throw new AppError('Format is required (md, txt, pdf, docx)', 400);

    const result = await chatService.exportConversation(userId, id, format);

    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.status(200).send(result.data);
  } catch (error) {
    next(error);
  }
};
