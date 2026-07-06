import mongoose, { Schema, Document } from 'mongoose';

export interface IAIGenerationHistoryDocument extends Document {
  user: mongoose.Types.ObjectId;
  provider: string;
  category: string;
  request: {
    prompt: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  };
  response: {
    text: string;
    modelUsed?: string;
  };
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  processingTime: number; // latency in ms
  status: 'SUCCESS' | 'FAILED';
  createdAt: Date;
}

const AIGenerationHistorySchema = new Schema<IAIGenerationHistoryDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    provider: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    request: {
      prompt: { type: String, required: true },
      model: { type: String },
      temperature: { type: Number },
      maxTokens: { type: Number },
      systemPrompt: { type: String },
    },
    response: {
      text: { type: String, required: true },
      modelUsed: { type: String },
    },
    tokenUsage: {
      promptTokens: { type: Number, default: 0 },
      completionTokens: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 },
    },
    processingTime: { type: Number, required: true },
    status: { type: String, enum: ['SUCCESS', 'FAILED'], required: true, index: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AIGenerationHistoryModel = mongoose.model<IAIGenerationHistoryDocument>(
  'AIGenerationHistory',
  AIGenerationHistorySchema
);
