import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { LoginDto } from "../dtos/requests/auth/login.dto";
import { RegisterDto } from "../dtos/requests/auth/register.dto";
import { IAuthController } from "../core/interfaces/controllers/IAuthController";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.util";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../utils/cookieUtils";
import { IAuthService } from "../core/interfaces/services/IAuthService";
import asyncHandler from "express-async-handler";
import CustomError from "../utils/CustomError";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  // Register a new user and send OTP to email
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userData: RegisterDto = req.body;

    const existingUser = await this.authService.findUserByEmail(userData.email);
    if (existingUser) throw new CustomError("User already exists", 400);

    const otp = this.authService.generateOTP();

    await this.authService.sendOtpEmail(userData.email, otp);

    res
      .status(200)
      .json({ message: "OTP sent to email. Please verify within 15 minutes" });
  });

  // Verify OTP and register user if OTP is correct and not expired
  verifyOTP = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;

    const userData = await this.authService.verifyAndRetrieveUser(email, otp);

    const result = await this.authService.register(userData);

    setRefreshTokenCookie(res, { _id: result._id.toString(), role: "user" });

    const accessToken = generateAccessToken({
      _id: result._id,
      name: result.name,
      email: result.email,
      role: "user",
    });
    const user = {
      _id: result._id,
      name: result.name,
      email: result.email,
      role: "user",
    };

    res.status(201).json({ user, accessToken });
  });

  // Resend OTP to email if OTP is expired or not received
  resendOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    await this.authService.resendOtp(email);

    res.status(200).json({ message: "New OTP sent to your email." });
  });

  // Login user and set refresh token cookie
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const loginDto: LoginDto = req.body;
    const user = await this.authService.login(loginDto);

    setRefreshTokenCookie(res, { _id: user._id.toString(), role: "user" });

    const accessToken = generateAccessToken({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: "user",
    });

    res.status(200).json({ message: "success", accessToken, user });
  });

  // Logout user and clear refresh token cookie
  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    clearRefreshTokenCookie(res);
    res.status(200).json({ message: "Logged out successfully." });
  });

  // Send password reset link to email with token
  forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    await this.authService.sendResetEmailWithToken(email);

    res.status(200).json({ message: "Password reset link sent to your email." });
  });

  // Verify token and update password if token is valid
  resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, token, password } = req.body;

    const isValid = await this.authService.validateToken(email, token);
    if (!isValid) throw new CustomError("Invalid or expired token.", 400);

    await this.authService.updatePassword(email, password);

    res.status(200).json({ message: "Password updated successfully." });
  });

  // Refresh access token using refresh token
  refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new CustomError("Refresh token not found", 401);

    const decodedToken = verifyRefreshToken(refreshToken);
    if (!decodedToken) throw new CustomError("Invalid token", 403);

    const user = await this.authService.getUserByRoleAndId(
      decodedToken.user.role,
      decodedToken.user._id
    );

    if (!user) {
      clearRefreshTokenCookie(res);
      throw new CustomError("User not found", 404);
    }

    if (user.status === "Blocked") {
      clearRefreshTokenCookie(res);
      throw new CustomError("User is blocked", 403);
    }

    const accessToken = generateAccessToken({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: decodedToken.user.role,
    });

    res.status(200).json({ accessToken, user });
  });

  // Verify access token and return user data
  verifyToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) throw new CustomError("Access token not found", 401);

    const payload = verifyAccessToken(accessToken);

    if (!payload) throw new CustomError("Invalid or expired access token", 403);

    const user = await this.authService.findUserByEmail(payload.user.email);

    if (!user) throw new CustomError("Invalid or expired access token", 403);

    res.status(200).json(payload.user);
  });
}
