import { Request, Response } from "express";
import { IAdminAuthController } from "../../core/interfaces/controllers/admin/IAdminAuthController";
import { LoginDto } from "../../dtos/requests/auth/login.dto";
import { NODE_ENV } from "../../utils/constants";
import { AdminAuthService } from "../../services/admin/admin.auth.service";
import redisClient from "../../config/redisClient.config";
import { verifyAccessToken } from "../../utils/jwt.util";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";

@injectable()
export class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject(TYPES.AdminAuthService) private adminAuthService: AdminAuthService
  ) {}

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

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginDto: LoginDto = req.body;
      const userData = await this.adminAuthService.login(loginDto);

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

      const tokens = await this.adminAuthService.refreshToken(refreshToken);
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

    const user = await this.adminAuthService.findUserByEmail(payload.user.email);

    if (!user) {
      res.status(403).json({ message: "Invalid or expired access token" });
      return;
    }

    res.status(200).json(payload.user);
  }
}
