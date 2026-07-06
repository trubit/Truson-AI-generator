import { SessionModel, ISessionDocument } from '../models/session.model';
import mongoose from 'mongoose';

export class SessionRepository {
  public async createSession(data: {
    userId: string;
    refreshToken: string;
    deviceInfo?: string;
    browser?: string;
    os?: string;
    ipAddress?: string;
    expiresAt: Date;
  }): Promise<ISessionDocument> {
    return SessionModel.create({
      userId: new mongoose.Types.ObjectId(data.userId),
      refreshToken: data.refreshToken,
      deviceInfo: data.deviceInfo || 'Unknown Device',
      browser: data.browser || 'Unknown Browser',
      os: data.os || 'Unknown OS',
      ipAddress: data.ipAddress || '127.0.0.1',
      expiresAt: data.expiresAt,
    });
  }

  public async findByRefreshToken(refreshToken: string): Promise<ISessionDocument | null> {
    return SessionModel.findOne({ refreshToken });
  }

  public async deleteByRefreshToken(refreshToken: string): Promise<void> {
    await SessionModel.deleteOne({ refreshToken });
  }

  public async deleteAllUserSessions(userId: string): Promise<void> {
    await SessionModel.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
  }
}

export const sessionRepository = new SessionRepository();
