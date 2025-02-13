import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dtos/requests/auth/login.dto";
import { RegisterDto } from "../dtos/requests/auth/register.dto";
import { CLIENT_URL, NODE_ENV } from "../utils/constants";
import { IAuthController } from "../core/interfaces/controllers/IAuthController";
import redisClient from "../config/redisClient.config";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.util";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../utils/cookieUtils";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: RegisterDto = req.body;

      const existingUser = await this.authService.findUserByEmail(userData.email);
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const otp = this.authService.generateOTP();

      const data = JSON.stringify({ userData, otp });

      await redisClient.setex(`otp:${userData.email}`, 900, data);

      await this.authService.sendOtpEmail(userData.email, otp);

      res.status(200).json({ message: "OTP sent to email. Please verify in 15 min" });
    } catch (error) {
      console.log(error);

      res.status(400).json({ message: "Registration failed", error });
    }
  };

  verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp } = req.body;

      const storedData = await redisClient.get(`otp:${email}`);

      if (!storedData) {
        res.status(400).json({ message: "OTP expired or invalid." });
        return;
      }

      const { userData, otp: storedOTP } = JSON.parse(storedData);

      if (otp !== storedOTP) {
        res.status(400).json({ message: "Invalid OTP." });
        return;
      }

      const result = await this.authService.register(userData);

      await redisClient.del(`otp:${email}`);

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
      };

      res.status(201).json({ user, accessToken });
    } catch (error) {
      res.status(500).json({ message: "OTP verification failed", error });
    }
  };

  resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = req.body.email;

      const existingData = await redisClient.get(`otp:${email}`);

      if (!existingData) {
        res
          .status(400)
          .json({ message: "OTP expired or not found. Please register again." });
        return;
      }

      const parsedData = JSON.parse(existingData);

      const newOtp = this.authService.generateOTP();

      parsedData.otp = newOtp;

      await redisClient.setex(`otp:${email}`, 900, JSON.stringify(parsedData));

      await this.authService.sendOtpEmail(email, newOtp);

      res.status(200).json({ message: "New OTP sent to your email." });
    } catch (error) {
      console.error("Error resending OTP:", error);
      res.status(500).json({ message: "Failed to resend OTP", error });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginDto: LoginDto = req.body;
      const user = await this.authService.login(loginDto);

      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      setRefreshTokenCookie(res, { _id: user._id.toString(), role: "user" });
      console.log("Login Controller");

      const accessToken = generateAccessToken({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
      });

      res.status(200).json({ message: "success", accessToken, user });
    } catch (error) {
      res.status(400).json({ message: "Login failed", error });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (refreshToken) await redisClient.del(refreshToken);

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ message: "An error occurred during logout." });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
      const token = this.authService.generateToken();

      redisClient.setex(`forgotPassword:${email}`, 900, token);

      const resetLink = `${CLIENT_URL}/login/reset-password?token=${token}&email=${email}`;

      await this.authService.sendResetEmail(email, resetLink);
      res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (error) {
      res.status(500).json({ error: "Failed to send reset link." });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, token, password } = req.body;

    try {
      const isValid = await this.authService.validateToken(email, token);
      if (!isValid) {
        res.status(400).json({ error: "Invalid or expired token." });
        return;
      }

      await this.authService.updatePassword(email, password);

      redisClient.del(`forgotPassword:${email}`);
      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to reset password." });
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token not found" });
      return;
    }

    const decodedToken = verifyRefreshToken(refreshToken);
    if (!decodedToken) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }

    try {
      const user = await this.authService.getUserByRoleAndId(
        decodedToken.user.role,
        decodedToken.user._id
      );

      if (!user) {
        clearRefreshTokenCookie(res);
        res.status(429).json({ message: "User not found" });
        return;
      }

      // if (user.status === 'Blocked') {
      //   clearRefreshTokenCookie(res);
      //   res.status(403).json({ message: 'User is blocked' });
      //   return;
      // }

      const accessToken = generateAccessToken({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: decodedToken.role,
      });

      res.status(200).json({ accessToken, user });
    } catch (error) {
      console.error("Error refreshing token:", error);
      clearRefreshTokenCookie(res);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  verifyToken = async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      res.status(401).json({ message: "Access token not found" });
      return;
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      res.status(403).json({ message: "Invalid or expired access token" });
      return;
    }

    const user = await this.authService.findUserByEmail(payload.user.email);

    if (!user) {
      res.status(403).json({ message: "Invalid or expired access token" });
      return;
    }

    res.status(200).json(payload.user);
  };

  // googleAuth = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const googleAccountData = req.body;

  //     const userData = await this.authService.googleLoginOrRegister(googleAccountData);
  //     if (userData) {
  //       if (!userData.accessToken || !userData.refreshToken) {
  //         res.status(400).json(userData);
  //         return;
  //       }

  //       this.setCookies(res, userData.accessToken, userData.refreshToken);

  //       const user = {
  //         _id: userData._id,
  //         name: userData.name,
  //         email: userData.email,
  //         accessToken: userData.accessToken,
  //       };
  //       res.status(200).json({ user });
  //     } else {
  //       res.status(401).json({ message: "Google Authentication Failed" });
  //     }
  //   } catch (error) {
  //     res.status(400).json({ message: "Login failed", error });
  //   }
  // };
}
