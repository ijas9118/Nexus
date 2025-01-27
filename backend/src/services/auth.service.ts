import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { LoginDto } from "../dtos/requests/auth/login.dto";
import { RegisterDto } from "../dtos/requests/auth/register.dto";
import { compare, hash } from "bcrypt";
import { RegisterResponseDto } from "../dtos/responses/auth/registerResponse.dto";
import { LoginResponseDto } from "../dtos/responses/auth/loginResponse.dto";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.util";
import redisClient from "../config/redisClient.config";
import crypto from "crypto";

@injectable()
export class AuthService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    console.log(email, otp);
  }

  async findUserByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !!user;
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const { name, email, password } = registerDto;
    const hashedPassword = await hash(password, 10);
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const userData = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

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

  async login(loginDto: LoginDto): Promise<LoginResponseDto | null> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findByEmail(email);
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

      const user = await this.userRepository.findById(decoded.user._id);

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

  async googleLoginOrRegister(userData: {
    name: string;
    email: string;
    picture: string;
  }): Promise<LoginResponseDto | null> {
    const { name, email, picture } = userData;

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      user = await this.userRepository.create({ name, email, password: "123456789" });
    }

    const data = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

    const accessToken = generateAccessToken(data);
    const refreshToken = generateRefreshToken(data);

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
}
