import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.config';
import { UserRole } from '../../../../../shared/index';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export class TokenService {
  public generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
  }

  public generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  public verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  }

  public verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  }
}

export const tokenService = new TokenService();
