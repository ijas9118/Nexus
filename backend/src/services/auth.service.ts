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
import nodemailer from "nodemailer";
import { APP_PASSWORD, USER_EMAIL } from "../utils/constants";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: USER_EMAIL,
    pass: APP_PASSWORD,
  },
});

@injectable()
export class AuthService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const expirationTime = "10 minutes";

    const mailOptions = {
      from: USER_EMAIL,
      to: email,
      subject: "Your OTP for Verification - Nexus",
      text: `Your OTP for verification is ${otp}. It is valid for ${expirationTime}.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
          <div style="background-color: #007bff; color: #ffffff; text-align: center; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Nexus</h1>
          </div>
    
          <div style="padding: 20px; color: #333333;">
            <h2 style="font-size: 20px; margin-bottom: 20px;">OTP Verification</h2>
            <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.5;">Thank you for registering with Nexus. Please use the following One-Time Password (OTP) to complete your verification:</p>
            <div style="font-size: 32px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0; padding: 10px; background-color: #f0f8ff; border-radius: 4px;">
              ${otp}
            </div>
            <p style="font-size: 16px; line-height: 1.5;">This OTP is valid for <strong>${expirationTime}</strong> from the time of request.</p>
            <p style="font-size: 16px; line-height: 1.5;">Date: <strong>${new Date().toLocaleString()}</strong></p>
            <p style="font-size: 16px; line-height: 1.5;">If you did not request this OTP, please ignore this email or contact our support team.</p>
          </div>
    
          <div style="text-align: center; padding: 20px; font-size: 14px; color: #777777; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
            <p style="margin: 0;">Best regards,<br>The Nexus Team</p>
            <p style="margin: 10px 0 0;"><a href="#" style="color: #007bff; text-decoration: none;">Visit our website</a></p>
            <p style="margin: 10px 0 0; font-size: 12px;">&copy; ${new Date().getFullYear()} Nexus. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending OTP email:", error);
      throw new Error("Failed to send OTP. Please try again later.");
    }

    console.log(email, otp);
  }

  async findUserByEmail(email: string): Promise<boolean> {
    console.log(email);
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
