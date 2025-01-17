import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dtos/requests/auth/login.dto";
import { RegisterDto } from "../dtos/requests/auth/register.dto";

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const registerDto: RegisterDto = req.body;
      const user = await this.authService.register(registerDto);
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
        res.status(200).json({ message: "Login successful", user });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(400).json({ message: "Login failed", error });
    }
  }
}
