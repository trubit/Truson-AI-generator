import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordResetDocument extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordResetDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const PasswordResetModel = mongoose.model<IPasswordResetDocument>(
  'PasswordReset',
  PasswordResetSchema
);
