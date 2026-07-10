import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../auth/middleware/auth.middleware';
import { contentService } from '../services/content.service';
import { createContentSchema, updateContentSchema, generateContentSchema } from '../validators/content.validator';
import { CONTENT_TEMPLATES } from '../templates/content-templates';

export class ContentController {
  public async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = createContentSchema.parse(req.body);
      const doc = await contentService.createContent(req.user!.userId, parsed);
      res.status(201).json({
        success: true,
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doc = await contentService.getContent(req.user!.userId, req.params.id);
      res.status(200).json({
        success: true,
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  }

  public async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = updateContentSchema.parse(req.body);
      const doc = await contentService.updateContent(req.user!.userId, req.params.id, parsed);
      res.status(200).json({
        success: true,
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await contentService.deleteContent(req.user!.userId, req.params.id);
      res.status(200).json({
        success: true,
        message: 'Document deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  public async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = req.query.search as string;
      const category = req.query.category as string;
      const contentType = req.query.contentType as string;
      const status = req.query.status as any;
      const isFavorite = req.query.isFavorite === 'true' ? true : req.query.isFavorite === 'false' ? false : undefined;
      const collectionId = req.query.collectionId as string;
      const tag = req.query.tag as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;

      const result = await contentService.listContent(req.user!.userId, {
        search,
        category,
        contentType,
        status,
        isFavorite,
        collectionId,
        tag,
        limit,
        skip,
      });

      res.status(200).json({
        success: true,
        data: result.items,
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  }

  public async listTemplates(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: CONTENT_TEMPLATES,
      });
    } catch (error) {
      next(error);
    }
  }

  public async generate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = generateContentSchema.parse(req.body);
      const result = await contentService.generateContent(req.user!.userId, parsed);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public async export(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const format = req.query.format as any || 'txt';
      const { filename, contentType, data } = await contentService.exportContent(
        req.user!.userId,
        req.params.id,
        format
      );

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      if (format === 'pdf' || format === 'docx') {
        res.send(data);
      } else {
        res.status(200).send(data);
      }
    } catch (error) {
      next(error);
    }
  }

  public async getVersions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await contentService.getVersions(req.user!.userId, req.params.id);
      res.status(200).json({
        success: true,
        data: list,
      });
    } catch (error) {
      next(error);
    }
  }

  public async restoreVersion(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const versionNumber = parseInt(req.body.versionNumber);
      const doc = await contentService.restoreVersion(req.user!.userId, req.params.id, versionNumber);
      res.status(200).json({
        success: true,
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const contentController = new ContentController();
