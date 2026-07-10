import mongoose, { Schema, Document } from 'mongoose';

export interface IContentDocument extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  category: string;
  contentType: string;
  editorMode: 'markdown' | 'rich-text';
  generatedContent: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  wordCount: number;
  readingTime: number;
  aiProvider: string;
  isFavorite: boolean;
  collectionId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContentDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, index: true },
    contentType: { type: String, required: true, index: true },
    editorMode: { type: String, enum: ['markdown', 'rich-text'], default: 'markdown' },
    generatedContent: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
    tags: { type: [String], default: [], index: true },
    wordCount: { type: Number, default: 0 },
    readingTime: { type: Number, default: 0 },
    aiProvider: { type: String, default: 'openai', index: true },
    isFavorite: { type: Boolean, default: false, index: true },
    collectionId: { type: Schema.Types.ObjectId, ref: 'ContentCollection', index: true },
  },
  {
    timestamps: true,
  }
);

// Compound index for optimized search + filter + sort operations
ContentSchema.index({ user: 1, isFavorite: 1, status: 1, updatedAt: -1 });
ContentSchema.index({ user: 1, collectionId: 1, updatedAt: -1 });

export const ContentModel = mongoose.model<IContentDocument>('Content', ContentSchema);
