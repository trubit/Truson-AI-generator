import mongoose, { Schema, Document } from 'mongoose';

export interface IAIProviderConfigDocument extends Document {
  providerName: string; // e.g. 'openai', 'claude', 'gemini'
  status: 'ENABLED' | 'DISABLED';
  priority: number; // lower number = higher priority for failover routing
  configurationMetadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const AIProviderConfigSchema = new Schema<IAIProviderConfigDocument>(
  {
    providerName: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ['ENABLED', 'DISABLED'], default: 'ENABLED', index: true },
    priority: { type: Number, default: 0, index: true },
    configurationMetadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

export const AIProviderConfigModel = mongoose.model<IAIProviderConfigDocument>(
  'AIProviderConfig',
  AIProviderConfigSchema
);
