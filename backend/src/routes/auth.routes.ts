import { Router } from 'express';
import passport from 'passport';

import type { IAuthController } from '@/core/interfaces/controllers/i-auth-controller';

import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { LoginRequestDTO, RegisterRequestDTO } from '@/dtos/requests/auth.dto';
import { validateRefreshToken } from '@/middlewares/auth.middleware';
import { validateDto } from '@/middlewares/validate-dto.middleware';
import { env } from '@/utils/env-validation';

const router = Router();
const authController = container.get<IAuthController>(TYPES.AuthController);

router.post('/register', validateDto(RegisterRequestDTO), authController.register);

router.post('/verify-otp', authController.verifyOTP);

router.post('/resend-otp', authController.resendOtp);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password', authController.resetPassword);

router.post('/login', validateDto(LoginRequestDTO), authController.login);

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
    failureRedirect: `${env.CLIENT_URL}/login`, // Redirect on failure
    session: false,
  }),
  authController.handleGoogleUser
);

router.get('/logout', authController.logout);

router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${env.CLIENT_URL}/login` }),
  authController.handleGithubUser
);

export default router;
