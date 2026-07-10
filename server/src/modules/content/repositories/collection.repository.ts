import { CollectionModel, ICollectionDocument } from '../models/collection.model';
import { ContentModel } from '../models/content.model';
import mongoose from 'mongoose';

export class CollectionRepository {
  public async create(userId: string, data: any): Promise<ICollectionDocument> {
    return await CollectionModel.create({
      user: new mongoose.Types.ObjectId(userId),
      ...data,
    });
  }

  public async findById(id: string, userId: string): Promise<ICollectionDocument | null> {
    return await CollectionModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user: new mongoose.Types.ObjectId(userId),
    });
  }

  public async update(id: string, userId: string, updates: any): Promise<ICollectionDocument | null> {
    return await CollectionModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        user: new mongoose.Types.ObjectId(userId),
      },
      { $set: updates },
      { new: true }
    );
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    const result = await CollectionModel.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
      user: new mongoose.Types.ObjectId(userId),
    });
    if (result.deletedCount && result.deletedCount > 0) {
      // Unlink all contents inside this collection
      await ContentModel.updateMany(
        { collectionId: new mongoose.Types.ObjectId(id), user: new mongoose.Types.ObjectId(userId) },
        { $unset: { collectionId: 1 } }
      );
      return true;
    }
    return false;
  }

  public async list(userId: string): Promise<ICollectionDocument[]> {
    return await CollectionModel.find({
      user: new mongoose.Types.ObjectId(userId),
    }).sort({ name: 1 });
  }

  public async checkNameExists(userId: string, name: string): Promise<boolean> {
    const count = await CollectionModel.countDocuments({
      user: new mongoose.Types.ObjectId(userId),
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });
    return count > 0;
  }
}

export const collectionRepository = new CollectionRepository();
