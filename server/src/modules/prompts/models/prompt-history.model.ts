import mongoose, { Schema, Document } from 'mongoose';

export interface IPromptHistoryDocument extends Document {
  user: mongoose.Types.ObjectId;
  promptCategory: string;
  programmingLanguage: string;
  framework: string;
  promptType: string;
  generatedPrompt: string;
  favoriteStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PromptHistorySchema = new Schema<IPromptHistoryDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    promptCategory: { type: String, required: true, index: true },
    programmingLanguage: { type: String, required: true, index: true },
    framework: { type: String, required: true, index: true },
    promptType: { type: String, required: true, index: true },
    generatedPrompt: { type: String, required: true },
    favoriteStatus: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

PromptHistorySchema.index({ user: 1, createdAt: -1 });

export const PromptHistoryModel = mongoose.model<IPromptHistoryDocument>(
  'PromptHistory',
  PromptHistorySchema
);
