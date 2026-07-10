import mongoose, { Schema, Document } from 'mongoose';

export interface IMessageDocument extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: 'user' | 'ai';
  content: string;
  attachmentsMetadata?: Array<{
    name: string;
    type: string;
    size: number;
    url?: string;
  }>;
  generationStatus: 'SUCCESS' | 'FAILED' | 'PENDING';
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  processingTime?: number; // ms
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessageDocument>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    sender: { type: String, enum: ['user', 'ai'], required: true, index: true },
    content: { type: String, required: true },
    attachmentsMetadata: { type: [Schema.Types.Mixed], default: [] },
    generationStatus: { type: String, enum: ['SUCCESS', 'FAILED', 'PENDING'], default: 'SUCCESS', index: true },
    tokenUsage: {
      promptTokens: { type: Number, default: 0 },
      completionTokens: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 },
    },
    processingTime: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ conversation: 1, createdAt: 1 });

export const MessageModel = mongoose.model<IMessageDocument>('Message', MessageSchema);
