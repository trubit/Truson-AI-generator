import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import {
  validate,
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// Authenticated Routes
router.use(authenticate as any);

router.get('/me', authController.me as any);
router.post('/logout-all', authController.logoutAll as any);
router.post('/change-password', validate(changePasswordSchema), authController.changePassword as any);

export const authRouter = router;
