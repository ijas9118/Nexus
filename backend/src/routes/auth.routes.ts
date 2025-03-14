import { IAuthController } from '@/core/interfaces/controllers/IAuthController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { validateRefreshToken } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validate.middleware';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendOTPSchema,
  resetPasswordSchema,
  verifyOTPSchema,
} from '@/validations/auth.schema';
import { Router } from 'express';

const router = Router();
const authController = container.get<IAuthController>(TYPES.AuthController);

router.post('/register', validateRequest(registerSchema), authController.register);

router.post('/verify-otp', validateRequest(verifyOTPSchema), authController.verifyOTP);

router.post('/resend-otp', validateRequest(resendOTPSchema), authController.resendOtp);

router.post(
  '/forgot-password',
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword
);

router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

router.post('/login', validateRequest(loginSchema), authController.login);

router.post('/refresh-token', validateRefreshToken, authController.refreshToken);

// router.post("/google", authController.googleAuth);

router.get('/logout', authController.logout);

export default router;
