import mongoose, { Schema, Document } from 'mongoose';

export interface IConversationDocument extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  provider: string; // openai | claude | gemini
  category: string;
  status: 'active' | 'archived';
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversationDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    provider: { type: String, required: true, default: 'openai', index: true },
    category: { type: String, required: true, default: 'General Writing', index: true },
    status: { type: String, enum: ['active', 'archived'], default: 'active', index: true },
    isPinned: { type: Boolean, default: false, index: true },
    isFavorite: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

ConversationSchema.index({ user: 1, status: 1, isPinned: -1, updatedAt: -1 });

export const ConversationModel = mongoose.model<IConversationDocument>(
  'Conversation',
  ConversationSchema
);
