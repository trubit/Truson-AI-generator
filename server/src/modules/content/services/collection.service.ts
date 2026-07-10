import { collectionRepository } from '../repositories/collection.repository';
import { AppError } from '../../../middleware/error.middleware';
import { ICollectionDocument } from '../models/collection.model';

export class CollectionService {
  public async createCollection(userId: string, data: any): Promise<ICollectionDocument> {
    const exists = await collectionRepository.checkNameExists(userId, data.name);
    if (exists) {
      throw new AppError('Collection with this name already exists', 400);
    }
    return await collectionRepository.create(userId, data);
  }

  public async getCollection(userId: string, id: string): Promise<ICollectionDocument> {
    const col = await collectionRepository.findById(id, userId);
    if (!col) {
      throw new AppError('Collection not found or unauthorized', 404);
    }
    return col;
  }

  public async updateCollection(userId: string, id: string, updates: any): Promise<ICollectionDocument> {
    await this.getCollection(userId, id);

    if (updates.name) {
      const exists = await collectionRepository.checkNameExists(userId, updates.name);
      const current = await collectionRepository.findById(id, userId);
      if (exists && current?.name.toLowerCase() !== updates.name.toLowerCase()) {
        throw new AppError('Collection with this name already exists', 400);
      }
    }

    const updated = await collectionRepository.update(id, userId, updates);
    if (!updated) {
      throw new AppError('Failed to update collection', 500);
    }
    return updated;
  }

  public async deleteCollection(userId: string, id: string): Promise<void> {
    const success = await collectionRepository.delete(id, userId);
    if (!success) {
      throw new AppError('Collection not found or unauthorized', 404);
    }
  }

  public async listCollections(userId: string): Promise<ICollectionDocument[]> {
    return await collectionRepository.list(userId);
  }
}

export const collectionService = new CollectionService();
