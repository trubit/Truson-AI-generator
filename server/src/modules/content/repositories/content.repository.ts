import { ContentModel, IContentDocument } from '../models/content.model';
import { VersionModel, IVersionDocument } from '../models/version.model';
import mongoose from 'mongoose';

export class ContentRepository {
  public async create(userId: string, data: any): Promise<IContentDocument> {
    return await ContentModel.create({
      user: new mongoose.Types.ObjectId(userId),
      ...data,
      collectionId: data.collectionId ? new mongoose.Types.ObjectId(data.collectionId) : undefined,
    });
  }

  public async findById(id: string, userId: string): Promise<IContentDocument | null> {
    return await ContentModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user: new mongoose.Types.ObjectId(userId),
    });
  }

  public async update(id: string, userId: string, updates: any): Promise<IContentDocument | null> {
    const filter = {
      _id: new mongoose.Types.ObjectId(id),
      user: new mongoose.Types.ObjectId(userId),
    };
    const mappedUpdates = { ...updates };
    if (updates.collectionId === null) {
      mappedUpdates.collectionId = undefined;
    } else if (updates.collectionId) {
      mappedUpdates.collectionId = new mongoose.Types.ObjectId(updates.collectionId);
    }
    return await ContentModel.findOneAndUpdate(
      filter,
      { $set: mappedUpdates },
      { new: true }
    );
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    const result = await ContentModel.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
      user: new mongoose.Types.ObjectId(userId),
    });
    if (result.deletedCount && result.deletedCount > 0) {
      await VersionModel.deleteMany({ contentId: new mongoose.Types.ObjectId(id) });
      return true;
    }
    return false;
  }

  public async list(userId: string, query: {
    search?: string;
    category?: string;
    contentType?: string;
    status?: 'draft' | 'published' | 'archived';
    isFavorite?: boolean;
    collectionId?: string;
    tag?: string;
    limit?: number;
    skip?: number;
  }): Promise<{ items: IContentDocument[]; total: number }> {
    const filter: any = { user: new mongoose.Types.ObjectId(userId) };

    if (query.status) {
      filter.status = query.status;
    }
    if (query.category) {
      filter.category = query.category;
    }
    if (query.contentType) {
      filter.contentType = query.contentType;
    }
    if (query.isFavorite !== undefined) {
      filter.isFavorite = query.isFavorite;
    }
    if (query.collectionId) {
      filter.collectionId = new mongoose.Types.ObjectId(query.collectionId);
    }
    if (query.tag) {
      filter.tags = query.tag;
    }
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { generatedContent: { $regex: query.search, $options: 'i' } },
      ];
    }

    const limit = query.limit || 20;
    const skip = query.skip || 0;

    const total = await ContentModel.countDocuments(filter);
    const items = await ContentModel.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    return { items, total };
  }

  public async createVersion(contentId: string, versionNumber: number, previousContent: string): Promise<IVersionDocument> {
    return await VersionModel.create({
      contentId: new mongoose.Types.ObjectId(contentId),
      versionNumber,
      previousContent,
    });
  }

  public async getVersions(contentId: string): Promise<IVersionDocument[]> {
    return await VersionModel.find({ contentId: new mongoose.Types.ObjectId(contentId) })
      .sort({ versionNumber: -1 });
  }

  public async getNextVersionNumber(contentId: string): Promise<number> {
    const latest = await VersionModel.findOne({ contentId: new mongoose.Types.ObjectId(contentId) })
      .sort({ versionNumber: -1 });
    return latest ? latest.versionNumber + 1 : 1;
  }
}

export const contentRepository = new ContentRepository();
