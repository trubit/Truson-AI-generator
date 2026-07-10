import mongoose, { Schema, Document } from 'mongoose';

export interface IPromptLibraryDocument extends Document {
  user: mongoose.Types.ObjectId;
  prompt: string;
  category: string;
  programmingLanguage: string;
  framework: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PromptLibrarySchema = new Schema<IPromptLibraryDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    prompt: { type: String, required: true },
    category: { type: String, required: true, index: true },
    programmingLanguage: { type: String, required: true, index: true },
    framework: { type: String, required: true, index: true },
    tags: { type: [String], default: [], index: true },
  },
  {
    timestamps: true,
  }
);

export const PromptLibraryModel = mongoose.model<IPromptLibraryDocument>(
  'PromptLibrary',
  PromptLibrarySchema
);
