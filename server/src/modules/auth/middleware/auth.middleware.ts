import { Request, Response, NextFunction } from 'express';
import { tokenService, TokenPayload } from '../services/token.service';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    let token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const decoded = tokenService.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (_error) {
    res.status(401).json({ success: false, message: 'Invalid or expired access token.' });
  }
};
