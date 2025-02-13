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
import { USER_EMAIL } from "../utils/constants";
import { transporter } from "../utils/nodemailerTransporter";

@injectable()
export class AuthService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  validateToken(email: string, token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      redisClient.get(`forgotPassword:${email}`, (err, storedToken) => {
        if (err) reject(err);
        resolve(storedToken === token);
      });
    });
  }

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

  async sendResetEmail(email: string, resetLink: string): Promise<void> {
    const mailOptions = {
      from: USER_EMAIL,
      to: email,
      subject: "Password Reset Request - Nexus",
      text: `You requested to reset your password. Click the link below to reset your password:\n\n${resetLink}\n\nThis link is valid for 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
          <!-- Header -->
          <div style="background-color: #007bff; color: #ffffff; text-align: center; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Nexus</h1>
          </div>
    
          <!-- Body -->
          <div style="padding: 20px; color: #333333;">
            <h2 style="font-size: 20px; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.5;">You requested to reset your password. Click the button below to reset your password:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 4px; margin: 20px 0;">Reset Password</a>
            <p style="font-size: 16px; line-height: 1.5;">This link is valid for <strong>15 minutes</strong>. If you did not request this, please ignore this email.</p>
          </div>
    
          <!-- Footer -->
          <div style="text-align: center; padding: 20px; font-size: 14px; color: #777777; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
            <p style="margin: 0;">Best regards,<br>The Nexus Team</p>
            <p style="margin: 10px 0 0;"><a href="https://www.nexus.com" style="color: #007bff; text-decoration: none;">Visit our website</a></p>
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

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto | null> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) throw new Error("Incorrect Credentials");

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });
    if (!user) throw new Error("User not found.");

    const hashedPassword = await hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();
  }

  async getUserByRoleAndId(role: string, id: string) {
    switch (role) {
      case "user":
        return await this.userRepository.getUserById(id);
      case "admin":
        return await this.userRepository.getUserById(id);
      case "mentor":
        return await this.userRepository.getUserById(id);
      default:
        return null;
    }
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
    };
  }
}
