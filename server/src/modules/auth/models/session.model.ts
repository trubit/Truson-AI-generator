import mongoose, { Schema, Document } from 'mongoose';

export interface ISessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
  deviceInfo?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    refreshToken: { type: String, required: true, index: true },
    deviceInfo: { type: String, default: 'Unknown Device' },
    browser: { type: String, default: 'Unknown Browser' },
    os: { type: String, default: 'Unknown OS' },
    ipAddress: { type: String, default: '127.0.0.1' },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index auto deletes expired sessions
  },
  {
    timestamps: true,
  }
);

export const SessionModel = mongoose.model<ISessionDocument>('Session', SessionSchema);
