import mongoose, { Schema, Document } from 'mongoose';

export interface ICollectionDocument extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  description: string;
  visibility: 'private' | 'public';
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollectionDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    visibility: { type: String, enum: ['private', 'public'], default: 'private' },
  },
  {
    timestamps: true,
  }
);

// Ensure user cannot create duplicate collection names
CollectionSchema.index({ user: 1, name: 1 }, { unique: true });

export const CollectionModel = mongoose.model<ICollectionDocument>('ContentCollection', CollectionSchema);
