import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../di/types';
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
import { CLIENT_URL } from '@/utils/constants/index';
import { Profile } from 'passport-google-oauth20';
import { Profile as GitHubProfile } from 'passport-github2';
import { IMentorService } from '@/core/interfaces/services/IMentorService';
import { LoginRequestDTO, RegisterRequestDTO } from '@/dtos/requests/auth.dto';
import { UserRole } from '@/core/types/UserTypes';

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService,
    @inject(TYPES.OTPService) private otpService: IOTPService,
    @inject(TYPES.EmailService) private emailService: IEmailService,
    @inject(TYPES.TokenService) private tokenService: ITokenService,
    @inject(TYPES.MentorService) private mentorService: IMentorService
  ) {}

  // Register a new user and send OTP to email
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userData = req.body as RegisterRequestDTO;

    const existingUser = await this.authService.findUserByEmail(userData.email);
    if (existingUser) {
      throw new CustomError('User already exists', StatusCodes.BAD_REQUEST);
    }

    const otp = this.otpService.generateOTP();

    await this.emailService.sendOtpEmail(userData, otp);

    res
      .status(StatusCodes.OK)
      .json({ message: 'OTP sent to email. Please verify within 15 minutes' });
  });

  // Verify OTP and register user if OTP is correct and not expired
  verifyOTP = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;

    const userData = await this.otpService.verifyAndRetrieveUser(email, otp);

    const user = await this.authService.register(userData);

    setRefreshTokenCookie(res, { _id: user._id, role: 'user' });

    const accessToken = generateAccessToken({ ...user });

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
    const user = await this.authService.login(req.body as LoginRequestDTO);

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

    const { _id, name, email, role } = decodedToken.user;

    if (role === 'admin') {
      const accessToken = generateAccessToken({ _id, name, email, role });
      res.status(StatusCodes.OK).json({ accessToken, user: decodedToken.user });
      return;
    }

    const user = await this.authService.getUserByRoleAndId(role, _id);

    if (!user) {
      clearRefreshTokenCookie(res);
      throw new CustomError('User not found', StatusCodes.NOT_FOUND);
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
      const mentor = await this.mentorService.getMentorByUserId(user._id.toString());
      if (!mentor) {
        clearRefreshTokenCookie(res);
        throw new CustomError('Mentor profile not found', StatusCodes.NOT_FOUND);
      }

      const mentorWithId = mentor as { _id: string };
      payload['mentorId'] = mentor._id;
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
