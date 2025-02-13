import { Request, Response } from "express";
import { IAdminAuthController } from "../../core/interfaces/controllers/admin/IAdminAuthController";
import { LoginDto } from "../../dtos/requests/auth/login.dto";
import { NODE_ENV } from "../../utils/constants";
import { AdminAuthService } from "../../services/admin/admin.auth.service";
import redisClient from "../../config/redisClient.config";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../utils/jwt.util";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../../utils/cookieUtils";

@injectable()
export class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject(TYPES.AdminAuthService) private adminAuthService: AdminAuthService
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginDto: LoginDto = req.body;
      const user = await this.adminAuthService.login(loginDto);

      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      setRefreshTokenCookie(res, { _id: user._id.toString(), role: "admin" });

      const accessToken = generateAccessToken({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "admin",
      });

      res.status(200).json({ message: "success", accessToken, user });
    } catch (error) {
      res.status(400).json({ message: "Login failed", error });
    }
  }

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      clearRefreshTokenCookie(res);
      res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ message: "An error occurred during logout." });
    }
  };

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
