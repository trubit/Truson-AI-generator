import mongoose, { Schema, Document } from 'mongoose';

export interface IVersionDocument extends Document {
  contentId: mongoose.Types.ObjectId;
  versionNumber: number;
  previousContent: string;
  createdAt: Date;
}

const VersionSchema = new Schema<IVersionDocument>(
  {
    contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true, index: true },
    versionNumber: { type: Number, required: true },
    previousContent: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Optimize version lookup by document ID
VersionSchema.index({ contentId: 1, versionNumber: -1 });

export const VersionModel = mongoose.model<IVersionDocument>('ContentVersion', VersionSchema);
