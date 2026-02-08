import type { Request, Response } from 'express';
import type { Profile as GitHubProfile } from 'passport-github2';
import type { Profile } from 'passport-google-oauth20';

import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import type { IAuthController } from '@/core/interfaces/controllers/i-auth-controller';
import type { IAuthService } from '@/core/interfaces/services/i-auth-service';
import type { IEmailService } from '@/core/interfaces/services/i-email-service';
import type { IMentorService } from '@/core/interfaces/services/i-mentor-service';
import type { IOTPService } from '@/core/interfaces/services/i-otp-service';
import type { ITokenService } from '@/core/interfaces/services/i-token-service';
import type { UserRole } from '@/core/types/user-types';
import type { LoginRequestDTO, RegisterRequestDTO } from '@/dtos/requests/auth.dto';

import logger from '@/config/logger';
import redisClient from '@/config/redis-client.config';
import { TYPES } from '@/di/types';
import { MESSAGES } from '@/utils/constants/message';
import { clearRefreshTokenCookie, setRefreshTokenCookie } from '@/utils/cookie-utils';
import CustomError from '@/utils/custom-error';
import { env } from '@/utils/env-validation';
import { generateAccessToken, verifyRefreshToken } from '@/utils/jwt.util';

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private _authService: IAuthService,
    @inject(TYPES.OTPService) private _otpService: IOTPService,
    @inject(TYPES.EmailService) private _emailService: IEmailService,
    @inject(TYPES.TokenService) private _tokenService: ITokenService,
    @inject(TYPES.MentorService) private _mentorService: IMentorService
  ) {}

  // Register a new user and send OTP to email
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userData = req.body as RegisterRequestDTO;

    const existingUser = await this._authService.findUserByEmail(userData.email);
    if (existingUser) {
      throw new CustomError(MESSAGES.AUTH_MESSAGES.USER_EXISTS, StatusCodes.BAD_REQUEST);
    }

    const otp = this._otpService.generateOTP();

    await this._emailService.sendOtpEmail(userData, otp);

    res.status(StatusCodes.OK).json({ message: MESSAGES.AUTH_MESSAGES.OTP_SENT });
  });

  // Verify OTP and register user if OTP is correct and not expired
  verifyOTP = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;

    const userData = await this._otpService.verifyAndRetrieveUser(email, otp);

    const user = await this._authService.register(userData);

    setRefreshTokenCookie(res, { _id: user._id, role: 'user' });

    const accessToken = generateAccessToken({ ...user });

    res.status(StatusCodes.CREATED).json({ user, accessToken });
  });

  // Resend OTP to email if OTP is expired or not received
  resendOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    await this._otpService.resendOtp(email);

    res.status(StatusCodes.OK).json({ message: MESSAGES.AUTH_MESSAGES.OTP_RESENT });
  });

  // Login user and set refresh token cookie
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this._authService.login(req.body as LoginRequestDTO);

    logger.error('Errorr loggin in');

    const isBlocked = await this._authService.isUserBlocked(user._id);

    if (isBlocked) {
      res.status(StatusCodes.FORBIDDEN).json({ message: MESSAGES.AUTH_MESSAGES.USER_BLOCKED });
      return;
    }

    setRefreshTokenCookie(res, { _id: user._id.toString(), role: user.role as UserRole });

    const accessToken = generateAccessToken({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      mentorId: user.mentorId,
      role: user.role as UserRole,
    });

    res.status(StatusCodes.OK).json({ message: 'success', accessToken, user });
  });

  // Logout user and clear refresh token cookie
  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    clearRefreshTokenCookie(res);
    res.status(StatusCodes.OK).json({ message: MESSAGES.AUTH_MESSAGES.LOGOUT_SUCCESS });
  });

  // Send password reset link to email with token
  forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    await this._emailService.sendResetEmailWithToken(email);

    res.status(StatusCodes.OK).json({ message: MESSAGES.AUTH_MESSAGES.PASSWORD_RESET_LINK_SENT });
  });

  // Verify token and update password if token is valid
  resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, token, password } = req.body;

    const isValid = await this._tokenService.validateToken(email, token);
    if (!isValid) {
      throw new CustomError(MESSAGES.AUTH_MESSAGES.REFRESH_TOKEN_INVALID, StatusCodes.BAD_REQUEST);
    }

    await this._authService.updatePassword(email, password);

    res.status(StatusCodes.OK).json({ message: MESSAGES.AUTH_MESSAGES.PASSWORD_UPDATED });
  });

  // Refresh access token using refresh token
  refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new CustomError(MESSAGES.AUTH_MESSAGES.REFRESH_TOKEN_MISSING, StatusCodes.UNAUTHORIZED);
    }

    const decodedToken = verifyRefreshToken(refreshToken);
    if (!decodedToken) {
      clearRefreshTokenCookie(res);
      throw new CustomError(MESSAGES.AUTH_MESSAGES.REFRESH_TOKEN_INVALID, StatusCodes.FORBIDDEN);
    }
    const isBlocked = await redisClient.get(`blocked_user:${decodedToken.user._id}`);
    if (isBlocked) {
      res.status(StatusCodes.FORBIDDEN).json({ message: MESSAGES.AUTH_MESSAGES.USER_BLOCKED });
      return;
    }

    const { _id, name, email, role } = decodedToken.user;

    if (role === 'admin') {
      const accessToken = generateAccessToken({ _id, name, email, role });
      res.status(StatusCodes.OK).json({ accessToken, user: decodedToken.user });
      return;
    }

    const user = await this._authService.getUserByRoleAndId(role, _id);

    if (!user) {
      clearRefreshTokenCookie(res);
      throw new CustomError(MESSAGES.AUTH_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const payload: any = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role,
    };

    let fullUser = user.toObject ? user.toObject() : user;

    // 🧙 If mentor, include mentorId
    if (role === 'mentor') {
      const mentor = await this._mentorService.getMentorByUserId(user._id.toString());
      if (!mentor) {
        clearRefreshTokenCookie(res);
        throw new CustomError(MESSAGES.AUTH_MESSAGES.MENTOR_NOT_FOUND, StatusCodes.NOT_FOUND);
      }

      const mentorWithId = mentor as { _id: string };
      payload.mentorId = mentor._id;
      fullUser = { ...fullUser, mentorId: mentorWithId._id.toString() };
    }

    const accessToken = generateAccessToken(payload);

    res.status(StatusCodes.OK).json({ accessToken, user: fullUser });
  });

  handleGoogleUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      return res.redirect('http://localhost:3000/login');
    }

    const googleProfile = req.user as unknown as Profile;

    if (!googleProfile.emails || googleProfile.emails.length === 0) {
      throw new CustomError(MESSAGES.AUTH_MESSAGES.GOOGLE_EMAIL_MISSING, StatusCodes.BAD_REQUEST);
    }

    const user = await this._authService.handleGoogleUser({
      googleId: googleProfile.id,
      email: googleProfile.emails[0].value,
      name: googleProfile.displayName,
      profile: googleProfile._json.picture as string,
    });

    setRefreshTokenCookie(res, { _id: user._id.toString(), role: 'user' });

    res.redirect(`${env.CLIENT_URL}/myFeed`);
  });

  handleGithubUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      return res.redirect('http://localhost:3000/login');
    }

    const githubProfile = req.user as unknown as GitHubProfile;

    if (!githubProfile.emails || githubProfile.emails.length === 0) {
      throw new CustomError(MESSAGES.AUTH_MESSAGES.GITHUB_EMAIL_MISSING, StatusCodes.BAD_REQUEST);
    }

    const user = await this._authService.handleGithubUser({
      githubId: githubProfile.id,
      email: githubProfile.emails[0].value,
      name: githubProfile.displayName || githubProfile.username || 'Unknown',
      profile: githubProfile.photos ? githubProfile.photos[0].value : '',
    });

    setRefreshTokenCookie(res, { _id: user._id.toString(), role: 'user' });
    res.redirect(`${env.CLIENT_URL}/myFeed`);
  });
}
