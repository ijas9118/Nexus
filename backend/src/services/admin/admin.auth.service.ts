import { compare } from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.util";
import { LoginDto } from "../../dtos/requests/auth/login.dto";
import { LoginResponseDto } from "../../dtos/responses/auth/loginResponse.dto";
import redisClient from "../../config/redisClient.config";
import { AdminRepository } from "../../repositories/admin.repository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";

@injectable()
export class AdminAuthService {
  constructor(@inject(TYPES.AdminRepository) private adminRepository: AdminRepository) {}

  async findUserByEmail(email: string): Promise<boolean> {
    const user = await this.adminRepository.findByEmail(email);
    return !!user;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto | null> {
    const { email, password } = loginDto;
    const user = await this.adminRepository.findByEmail(email);

    if (!user) return null;

    const userData = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) return null;

    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    const key = `refreshToken:${user._id}`;
    await redisClient.set(key, refreshToken, "EX", 7 * 24 * 60 * 60);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const key = `refreshToken:${decoded.user._id}`;
      const storedToken = await redisClient.get(key);

      if (!storedToken || storedToken !== refreshToken) {
        throw new Error("Invalid or expired Refresh token");
      }

      const user = await this.adminRepository.findById(decoded.user._id);

      if (!user) throw new Error("User not found");

      const userData = {
        _id: user._id,
        email: user.email,
        name: user.name,
      };

      const accessToken = generateAccessToken(userData);
      const newRefreshToken = generateRefreshToken(userData);

      await redisClient.set(key, newRefreshToken, "EX", 7 * 24 * 60 * 60);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error("Refresh token verification failed:", error);
      return null;
    }
  }
}
