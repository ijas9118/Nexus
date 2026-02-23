import type { Request, Response } from "express";
import type { Profile as GitHubProfile } from "passport-github2";
import type { Profile } from "passport-google-oauth20";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IAuthController } from "@/core/interfaces/controllers/i-auth-controller";
import type { IAuthService } from "@/core/interfaces/services/i-auth-service";
import type { IEmailService } from "@/core/interfaces/services/i-email-service";
import type { IOTPService } from "@/core/interfaces/services/i-otp-service";
import type { ITokenService } from "@/core/interfaces/services/i-token-service";
import type { UserRole } from "@/core/types/user-types";
import type { LoginRequestDTO, RegisterRequestDTO } from "@/dtos/requests/auth.dto";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "@/utils/cookie-utils";
import CustomError from "@/utils/custom-error";
import { env } from "@/utils/env-validation";

const { AUTH_MESSAGES, ADMIN_MESSAGES } = MESSAGES;

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private _authService: IAuthService,
    @inject(TYPES.OTPService) private _otpService: IOTPService,
    @inject(TYPES.EmailService) private _emailService: IEmailService,
    @inject(TYPES.TokenService) private _tokenService: ITokenService,
  ) {}

  // Register a new user and send OTP to email
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userData = req.body as RegisterRequestDTO;

    const existingUser = await this._authService.findUserByEmail(userData.email);
    if (existingUser) {
      throw new CustomError(AUTH_MESSAGES.USER_EXISTS, StatusCodes.BAD_REQUEST);
    }

    const otp = this._otpService.generateOTP();

    await this._emailService.sendOtpEmail(userData, otp);

    res.status(StatusCodes.OK).json({ message: AUTH_MESSAGES.OTP_SENT });
  });

  // Verify OTP and register user if OTP is correct and not expired
  verifyOTP = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;

    const userData = await this._otpService.verifyAndRetrieveUser(email, otp);

    const { user, accessToken } = await this._authService.register(userData);

    setRefreshTokenCookie(res, { _id: user._id, role: "user" });

    res.status(StatusCodes.CREATED).json({ user, accessToken });
  });

  // Resend OTP to email if OTP is expired or not received
  resendOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    await this._otpService.resendOtp(email);

    res.status(StatusCodes.OK).json({ message: AUTH_MESSAGES.OTP_RESENT });
  });

  // Login user and set refresh token cookie
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { user, accessToken } = await this._authService.login(req.body as LoginRequestDTO);

    setRefreshTokenCookie(res, { _id: user._id.toString(), role: user.role as UserRole });

    res.status(StatusCodes.OK).json({ message: ADMIN_MESSAGES.LOGIN_SUCCESS, accessToken, user });
  });

  // Logout user and clear refresh token cookie
  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    clearRefreshTokenCookie(res);
    res.status(StatusCodes.OK).json({ message: AUTH_MESSAGES.LOGOUT_SUCCESS });
  });

  // Send password reset link to email with token
  forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    await this._emailService.sendResetEmailWithToken(email);

    res.status(StatusCodes.OK).json({ message: AUTH_MESSAGES.PASSWORD_RESET_LINK_SENT });
  });

  // Verify token and update password if token is valid
  resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, token, password } = req.body;

    const isValid = await this._tokenService.validateToken(email, token);
    if (!isValid) {
      throw new CustomError(AUTH_MESSAGES.REFRESH_TOKEN_INVALID, StatusCodes.BAD_REQUEST);
    }

    await this._authService.updatePassword(email, password);

    res.status(StatusCodes.OK).json({ message: AUTH_MESSAGES.PASSWORD_UPDATED });
  });

  // Refresh access token using refresh token
  refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new CustomError(AUTH_MESSAGES.REFRESH_TOKEN_MISSING, StatusCodes.UNAUTHORIZED);
    }

    try {
      const { accessToken, user } = await this._authService.refreshToken(refreshToken);
      res.status(StatusCodes.OK).json({ accessToken, user });
    }
    catch (error) {
      if (error instanceof CustomError && error.message === AUTH_MESSAGES.REFRESH_TOKEN_INVALID) {
        clearRefreshTokenCookie(res);
      }
      throw error;
    }
  });

  handleGoogleUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      return res.redirect(`${env.CLIENT_URL}/login`);
    }

    const googleProfile = req.user as unknown as Profile;

    if (!googleProfile.emails || googleProfile.emails.length === 0) {
      throw new CustomError(AUTH_MESSAGES.GOOGLE_EMAIL_MISSING, StatusCodes.BAD_REQUEST);
    }

    const user = await this._authService.handleGoogleUser({
      googleId: googleProfile.id,
      email: googleProfile.emails[0].value,
      name: googleProfile.displayName,
      profile: googleProfile._json.picture as string,
    });

    setRefreshTokenCookie(res, { _id: user._id.toString(), role: user.role as UserRole });

    res.redirect(`${env.CLIENT_URL}/myFeed?session=active`);
  });

  handleGithubUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      return res.redirect(`${env.CLIENT_URL}/login`);
    }

    const githubProfile = req.user as unknown as GitHubProfile;

    if (!githubProfile.emails || githubProfile.emails.length === 0) {
      throw new CustomError(AUTH_MESSAGES.GITHUB_EMAIL_MISSING, StatusCodes.BAD_REQUEST);
    }

    const user = await this._authService.handleGithubUser({
      githubId: githubProfile.id,
      email: githubProfile.emails[0].value,
      name: githubProfile.displayName || githubProfile.username || "Unknown",
      profile: githubProfile.photos ? githubProfile.photos[0].value : "",
    });

    setRefreshTokenCookie(res, { _id: user._id.toString(), role: user.role as UserRole });
    res.redirect(`${env.CLIENT_URL}/myFeed?session=active`);
  });
}
