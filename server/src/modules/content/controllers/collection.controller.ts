import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../auth/middleware/auth.middleware';
import { collectionService } from '../services/collection.service';
import { createCollectionSchema, updateCollectionSchema } from '../validators/content.validator';

export class CollectionController {
  public async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = createCollectionSchema.parse(req.body);
      const col = await collectionService.createCollection(req.user!.userId, parsed);
      res.status(201).json({
        success: true,
        data: col,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const col = await collectionService.getCollection(req.user!.userId, req.params.id);
      res.status(200).json({
        success: true,
        data: col,
      });
    } catch (error) {
      next(error);
    }
  }

  public async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = updateCollectionSchema.parse(req.body);
      const col = await collectionService.updateCollection(req.user!.userId, req.params.id, parsed);
      res.status(200).json({
        success: true,
        data: col,
      });
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await collectionService.deleteCollection(req.user!.userId, req.params.id);
      res.status(200).json({
        success: true,
        message: 'Collection deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  public async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await collectionService.listCollections(req.user!.userId);
      res.status(200).json({
        success: true,
        data: list,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const collectionController = new CollectionController();
