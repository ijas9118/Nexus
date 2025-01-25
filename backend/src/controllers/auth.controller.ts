import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dtos/requests/auth/login.dto";
import { RegisterDto } from "../dtos/requests/auth/register.dto";
import { NODE_ENV } from "../utils/constants";
import { IAuthController } from "../core/interfaces/controllers/IAuthController";
import redisClient from "../config/redisClient.config";
import { verifyAccessToken } from "../utils/jwt.util";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  private setCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  async register(req: Request, res: Response): Promise<void> {
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
      res.status(400).json({ message: "Registration failed", error });
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
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

      this.setCookies(res, result.accessToken, result.refreshToken);

      const user = {
        _id: result._id,
        name: result.name,
        email: result.email,
        accessToken: userData.accessToken,
      };

      res.status(201).json({ user });
    } catch (error) {
      res.status(500).json({ message: "OTP verification failed", error });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginDto: LoginDto = req.body;
      const userData = await this.authService.login(loginDto);

      if (userData) {
        if (!userData.accessToken || !userData.refreshToken) {
          res.status(400).json(userData);
          return;
        }

        this.setCookies(res, userData.accessToken, userData.refreshToken);

        const user = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          accessToken: userData.accessToken,
        };
        res.status(200).json({ user });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(400).json({ message: "Login failed", error });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
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
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token not found" });
        return;
      }

      const tokens = await this.authService.refreshToken(refreshToken);
      if (!tokens) {
        res.status(403).json({ message: "Invalid or expired refresh token" });
        return;
      }

      this.setCookies(res, tokens.accessToken, tokens.refreshToken);

      res.status(200).json({ accessToken: tokens.accessToken });
    } catch (error) {
      res.status(500).json({ message: "Token refresh failed", error });
    }
  }

  async verifyToken(req: Request, res: Response): Promise<void> {
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
  }

  async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const googleAccountData = req.body;

      const userData = await this.authService.googleLoginOrRegister(googleAccountData);
      if (userData) {
        if (!userData.accessToken || !userData.refreshToken) {
          res.status(400).json(userData);
          return;
        }

        this.setCookies(res, userData.accessToken, userData.refreshToken);

        const user = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          accessToken: userData.accessToken,
        };
        res.status(200).json({ user });
      } else {
        res.status(401).json({ message: "Google Authentication Failed" });
      }
    } catch (error) {
      res.status(400).json({ message: "Login failed", error });
    }
  }
}
