import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { userRepository } from '../repositories/user.repository';
import { sessionRepository } from '../repositories/session.repository';
import { tokenService } from './token.service';
import { emailService } from './email.service';
import { VerificationTokenModel } from '../models/verification-token.model';
import { PasswordResetModel } from '../models/password-reset.model';
import { RegisterDTO, LoginDTO, ChangePasswordDTO, IUser } from '../../../../../shared/index';

export class AuthService {
  public async register(dto: RegisterDTO) {
    const existingEmail = await userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new Error('An account with this email address already exists.');
    }

    const existingUsername = await userRepository.findByUsername(dto.username);
    if (existingUsername) {
      throw new Error('Username is already taken.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await userRepository.create({ ...dto, passwordHash });

    // Generate Verification Token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    await VerificationTokenModel.create({
      userId: user._id,
      token: verifyToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 Hours
    });

    // Send Verification Email
    await emailService.sendVerificationEmail(user.email, `${user.firstName} ${user.lastName}`, verifyToken);

    return this.mapUserToDTO(user);
  }

  public async verifyEmail(token: string) {
    const record = await VerificationTokenModel.findOne({ token });
    if (!record || record.expiresAt < new Date()) {
      throw new Error('Invalid or expired email verification token.');
    }

    const user = await userRepository.findById(record.userId.toString());
    if (!user) {
      throw new Error('User not found.');
    }

    user.isEmailVerified = true;
    user.status = 'ACTIVE';
    await user.save();

    await VerificationTokenModel.deleteOne({ _id: record._id });
    return this.mapUserToDTO(user);
  }

  public async login(dto: LoginDTO, reqMeta: { ip?: string; userAgent?: string }) {
    const user = dto.loginIdentifier.includes('@')
      ? await userRepository.findByEmail(dto.loginIdentifier)
      : await userRepository.findByUsername(dto.loginIdentifier);

    if (!user) {
      throw new Error('Invalid login credentials.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid login credentials.');
    }

    if (user.status === 'SUSPENDED') {
      throw new Error('Your account has been suspended. Please contact support.');
    }

    // Auto-verify in development or test environments if needed
    if (!user.isEmailVerified && process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
      throw new Error('Please verify your email address before logging in.');
    }

    user.lastLogin = new Date();
    if (user.status === 'INACTIVE') user.status = 'ACTIVE';
    await user.save();

    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const accessToken = tokenService.generateAccessToken(payload);
    const refreshToken = tokenService.generateRefreshToken(payload);

    // Save session in MongoDB
    await sessionRepository.createSession({
      userId: user._id.toString(),
      refreshToken,
      ipAddress: reqMeta.ip,
      deviceInfo: reqMeta.userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      user: this.mapUserToDTO(user),
      accessToken,
      refreshToken,
    };
  }

  public async refreshToken(oldRefreshToken: string) {
    const payload = tokenService.verifyRefreshToken(oldRefreshToken);
    const session = await sessionRepository.findByRefreshToken(oldRefreshToken);

    if (!session) {
      throw new Error('Invalid or revoked session.');
    }

    await sessionRepository.deleteByRefreshToken(oldRefreshToken);

    const user = await userRepository.findById(payload.userId);
    if (!user || user.status === 'SUSPENDED') {
      throw new Error('User account disabled or not found.');
    }

    const newPayload = { userId: user._id.toString(), email: user.email, role: user.role };
    const newAccessToken = tokenService.generateAccessToken(newPayload);
    const newRefreshToken = tokenService.generateRefreshToken(newPayload);

    await sessionRepository.createSession({
      userId: user._id.toString(),
      refreshToken: newRefreshToken,
      ipAddress: session.ipAddress,
      deviceInfo: session.deviceInfo,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: this.mapUserToDTO(user),
    };
  }

  public async logout(refreshToken: string) {
    if (refreshToken) {
      await sessionRepository.deleteByRefreshToken(refreshToken);
    }
  }

  public async logoutAll(userId: string) {
    await sessionRepository.deleteAllUserSessions(userId);
  }

  public async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) return; // Silent return for privacy

    await PasswordResetModel.deleteMany({ userId: user._id });

    const resetToken = crypto.randomBytes(32).toString('hex');
    await PasswordResetModel.create({
      userId: user._id,
      token: resetToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    await emailService.sendPasswordResetEmail(user.email, `${user.firstName} ${user.lastName}`, resetToken);
  }

  public async resetPassword(token: string, newPassword: string) {
    const resetRecord = await PasswordResetModel.findOne({ token });
    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      throw new Error('Invalid or expired password reset token.');
    }

    const user = await userRepository.findById(resetRecord.userId.toString());
    if (!user) {
      throw new Error('User not found.');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordUpdatedAt = new Date();
    await user.save();

    await PasswordResetModel.deleteOne({ _id: resetRecord._id });
    await sessionRepository.deleteAllUserSessions(user._id.toString());
  }

  public async changePassword(userId: string, dto: ChangePasswordDTO) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    const fullUser = await userRepository.findByEmail(user.email);
    if (!fullUser) throw new Error('User not found.');

    const isMatch = await bcrypt.compare(dto.currentPassword, fullUser.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect.');
    }

    const salt = await bcrypt.genSalt(10);
    fullUser.password = await bcrypt.hash(dto.newPassword, salt);
    fullUser.passwordUpdatedAt = new Date();
    await fullUser.save();

    await sessionRepository.deleteAllUserSessions(userId);
  }

  public async getProfile(userId: string): Promise<IUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User profile not found.');
    }
    return this.mapUserToDTO(user);
  }

  public mapUserToDTO(user: any): IUser {
    return {
      id: user._id ? user._id.toString() : user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      avatar: user.avatar || '',
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : undefined,
      createdAt: user.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : new Date().toISOString(),
    };
  }
}

export const authService = new AuthService();
