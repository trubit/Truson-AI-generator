import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export const checkPermission = (requiredPermission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthenticated.' });
      return;
    }

    // SUPER_ADMIN has full permissions
    if (req.user.role === 'SUPER_ADMIN') {
      next();
      return;
    }

    // Extensible permission logic
    next();
  };
};
