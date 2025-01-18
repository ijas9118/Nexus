import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dtos/requests/auth/login.dto";
import { RegisterDto } from "../dtos/requests/auth/register.dto";
import { NODE_ENV } from "../utils/constants";

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  private setCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const registerDto: RegisterDto = req.body;
      const user = await this.authService.register(registerDto);

      if (!user.accessToken || !user.refreshToken) {
        res.status(400).json(user);
        return;
      }

      this.setCookies(res, user.accessToken, user.refreshToken);

      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      res.status(400).json({ message: "Registration failed", error });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginDto: LoginDto = req.body;
      const user = await this.authService.login(loginDto);

      if (user) {
        if (!user.accessToken || !user.refreshToken) {
          res.status(400).json(user);
          return;
        }

        this.setCookies(res, user.accessToken, user.refreshToken);
        res.status(200).json({ message: "Login successful", user });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(400).json({ message: "Login failed", error });
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

      res.status(200).json({ message: "Tokens refreshed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Token refresh failed", error });
    }
  }
}
