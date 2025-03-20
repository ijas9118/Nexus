import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../di/types';
import { LoginDto } from '../dtos/requests/auth/login.dto';
import { RegisterDto } from '../dtos/requests/auth/register.dto';
import { IAuthController } from '../core/interfaces/controllers/IAuthController';
import { generateAccessToken, verifyRefreshToken } from '../utils/jwt.util';
import { clearRefreshTokenCookie, setRefreshTokenCookie } from '../utils/cookieUtils';
import { IAuthService } from '../core/interfaces/services/IAuthService';
import asyncHandler from 'express-async-handler';
import CustomError from '../utils/CustomError';
import { StatusCodes } from 'http-status-codes';
import { IOTPService } from '../core/interfaces/services/IOTPService';
import { IEmailService } from '../core/interfaces/services/IEmailService';
import { ITokenService } from '../core/interfaces/services/ITokenService';
import { CLIENT_URL } from '@/utils/constants';
import { Profile } from 'passport-google-oauth20';
import { Profile as GitHubProfile } from 'passport-github2';
import { UserRole } from '@/core/types/UserTypes';

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService,
    @inject(TYPES.OTPService) private otpService: IOTPService,
    @inject(TYPES.EmailService) private emailService: IEmailService,
    @inject(TYPES.TokenService) private tokenService: ITokenService
  ) {}

  // Register a new user and send OTP to email
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userData: RegisterDto = req.body;

    const existingUser = await this.authService.findUserByEmail(userData.email);
    if (existingUser) {
      throw new CustomError('User already exists', StatusCodes.BAD_REQUEST);
    }

    const otp = this.otpService.generateOTP();

    await this.emailService.sendOtpEmail(userData.email, otp);

    res
      .status(StatusCodes.OK)
      .json({ message: 'OTP sent to email. Please verify within 15 minutes' });
  });

  // Verify OTP and register user if OTP is correct and not expired
  verifyOTP = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;

    const userData = await this.otpService.verifyAndRetrieveUser(email, otp);

    const result = await this.authService.register(userData);

    setRefreshTokenCookie(res, { _id: result._id.toString(), role: 'user' });

    const accessToken = generateAccessToken({
      _id: result._id.toString(),
      name: result.name,
      email: result.email,
      role: 'user',
    });
    const user = {
      _id: result._id,
      name: result.name,
      email: result.email,
      role: 'user',
    };

    res.status(StatusCodes.CREATED).json({ user, accessToken });
  });

  // Resend OTP to email if OTP is expired or not received
  resendOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    await this.otpService.resendOtp(email);

    res.status(StatusCodes.OK).json({ message: 'New OTP sent to your email.' });
  });

  // Login user and set refresh token cookie
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const loginDto: LoginDto = req.body;
    const user = await this.authService.login(loginDto);

    setRefreshTokenCookie(res, { _id: user._id.toString(), role: user.role as UserRole });

    const accessToken = generateAccessToken({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
    });

    res.status(StatusCodes.OK).json({ message: 'success', accessToken, user });
  });

  // Logout user and clear refresh token cookie
  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    clearRefreshTokenCookie(res);
    res.status(StatusCodes.OK).json({ message: 'Logged out successfully.' });
  });

  // Send password reset link to email with token
  forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    await this.emailService.sendResetEmailWithToken(email);

    res.status(StatusCodes.OK).json({ message: 'Password reset link sent to your email.' });
  });

  // Verify token and update password if token is valid
  resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, token, password } = req.body;

    const isValid = await this.tokenService.validateToken(email, token);
    if (!isValid) {
      throw new CustomError('Invalid or expired token.', StatusCodes.BAD_REQUEST);
    }

    await this.authService.updatePassword(email, password);

    res.status(StatusCodes.OK).json({ message: 'Password updated successfully.' });
  });

  // Refresh access token using refresh token
  refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new CustomError('Refresh token not found', StatusCodes.UNAUTHORIZED);
    }

    const decodedToken = verifyRefreshToken(refreshToken);
    if (!decodedToken) {
      throw new CustomError('Invalid token', StatusCodes.FORBIDDEN);
    }

    if (decodedToken.user.role === 'admin') {
      const accessToken = generateAccessToken({
        _id: decodedToken.user._id,
        name: decodedToken.user.name,
        email: decodedToken.user.email,
        role: decodedToken.user.role,
      });

      res.status(StatusCodes.OK).json({ accessToken, decodedToken });
    }

    const user = await this.authService.getUserByRoleAndId(
      decodedToken.user.role,
      decodedToken.user._id
    );

    if (!user) {
      clearRefreshTokenCookie(res);
      throw new CustomError('User not found', StatusCodes.NOT_FOUND);
    }

    // if (user.status === 'Blocked') {
    //   clearRefreshTokenCookie(res);
    //   throw new CustomError('User is blocked', StatusCodes.FORBIDDEN);
    // }

    const accessToken = generateAccessToken({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: decodedToken.user.role,
    });

    res.status(StatusCodes.OK).json({ accessToken, user });
  });

  handleGoogleUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      return res.redirect('http://localhost:3000/login');
    }

    const googleProfile = req.user as unknown as Profile;

    if (!googleProfile.emails || googleProfile.emails.length === 0) {
      throw new CustomError('No email provided by Google', StatusCodes.BAD_REQUEST);
    }

    const user = await this.authService.handleGoogleUser({
      googleId: googleProfile.id,
      email: googleProfile.emails[0].value,
      name: googleProfile.displayName,
      profile: googleProfile._json.picture as string,
    });

    setRefreshTokenCookie(res, { _id: user._id.toString(), role: 'user' });

    res.redirect(`${CLIENT_URL}/myFeed`);
  });

  handleGithubUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      return res.redirect('http://localhost:3000/login');
    }

    const githubProfile = req.user as unknown as GitHubProfile;

    if (!githubProfile.emails || githubProfile.emails.length === 0) {
      throw new CustomError('No email provided by GitHub', StatusCodes.BAD_REQUEST);
    }

    console.log(githubProfile);

    const user = await this.authService.handleGithubUser({
      githubId: githubProfile.id,
      email: githubProfile.emails[0].value,
      name: githubProfile.displayName || githubProfile.username || 'Unknown',
      profile: githubProfile.photos ? githubProfile.photos[0].value : '',
    });

    setRefreshTokenCookie(res, { _id: user._id.toString(), role: 'user' });
    res.redirect(`${CLIENT_URL}/myFeed`);
  });
}
