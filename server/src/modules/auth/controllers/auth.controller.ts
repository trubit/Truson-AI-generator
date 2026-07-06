import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { RegisterDTO, LoginDTO, ChangePasswordDTO } from '../../../../../shared/index';

export class AuthController {
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as RegisterDTO;
      const user = await authService.register(dto);
      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        user,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  public verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body;
      const user = await authService.verifyEmail(token);
      res.status(200).json({
        success: true,
        message: 'Email verified successfully. You may now log in.',
        user,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as LoginDTO;
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const { user, accessToken, refreshToken } = await authService.login(dto, { ip, userAgent });

      // Set Refresh Token in HttpOnly Cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        user,
        accessToken,
      });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      if (!token) {
        res.status(401).json({ success: false, message: 'Refresh token required.' });
        return;
      }

      const { accessToken, refreshToken: newRefreshToken, user } = await authService.refreshToken(token);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        accessToken,
        user,
      });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      await authService.logout(token);

      res.clearCookie('refreshToken');
      res.status(200).json({ success: true, message: 'Logged out successfully.' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  public logoutAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthenticated.' });
        return;
      }

      await authService.logoutAll(req.user.userId);
      res.clearCookie('refreshToken');
      res.status(200).json({ success: true, message: 'Logged out from all devices.' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);
      res.status(200).json({
        success: true,
        message: 'If an account exists for that email, password reset instructions have been sent.',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, password } = req.body;
      await authService.resetPassword(token, password);
      res.status(200).json({
        success: true,
        message: 'Password reset successfully. You may now log in with your new password.',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  public changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthenticated.' });
        return;
      }
      const dto = req.body as ChangePasswordDTO;
      await authService.changePassword(req.user.userId, dto);
      res.clearCookie('refreshToken');
      res.status(200).json({
        success: true,
        message: 'Password changed successfully. Please log in again.',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  public me = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthenticated.' });
        return;
      }
      const user = await authService.getProfile(req.user.userId);
      res.status(200).json({ success: true, user });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };
}

export const authController = new AuthController();
