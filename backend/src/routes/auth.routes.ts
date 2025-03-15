import { IAuthController } from '@/core/interfaces/controllers/IAuthController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { validateRefreshToken } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validate.middleware';
import { CLIENT_URL } from '@/utils/constants';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendOTPSchema,
  resetPasswordSchema,
  verifyOTPSchema,
} from '@/validations/auth.schema';
import { Router } from 'express';
import passport from 'passport';

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

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: CLIENT_URL + '/login', // Redirect on failure
    session: false,
  }),
  authController.handleGoogleUser
);

router.get('/logout', authController.logout);

export default router;
