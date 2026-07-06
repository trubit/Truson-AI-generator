import mongoose, { Schema, Document } from 'mongoose';

export interface IVerificationTokenDocument extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationTokenDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // Auto purge after expiration
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const VerificationTokenModel = mongoose.model<IVerificationTokenDocument>(
  'VerificationToken',
  VerificationTokenSchema
);
