import mongoose, { Schema, Document } from 'mongoose';
import { UserRole, UserStatus } from '../../../../../shared/index';

export interface IUserDocument extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  lastLogin?: Date;
  passwordUpdatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String, default: '' },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
      default: 'USER',
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
      default: 'INACTIVE', // Activated upon email verification
      index: true,
    },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    passwordUpdatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
