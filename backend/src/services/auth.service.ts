import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { LoginDto } from "../dtos/requests/auth/login.dto";
import { RegisterDto } from "../dtos/requests/auth/register.dto";
import { compare, hash } from "bcrypt";
import { RegisterResponseDto } from "../dtos/responses/auth/registerResponse.dto";
import { LoginResponseDto } from "../dtos/responses/auth/loginResponse.dto";
import { generateRefreshToken } from "../utils/jwt.util";
import redisClient from "../config/redisClient.config";
import crypto from "crypto";
import { CLIENT_URL, USER_EMAIL } from "../utils/constants";
import { transporter } from "../utils/nodemailerTransporter";
import { IAuthService } from "../core/interfaces/services/IAuthService";
import CustomError from "../utils/CustomError";
import { StatusCodes } from "http-status-codes";

@injectable()
export class AuthService implements IAuthService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  // Generate a random username for the user
  private generateUsername(): string {
    const adjectives = ["Witty", "Silly", "Happy", "Lazy", "Grumpy", "Quirky", "Sleepy"];
    const nouns = ["Cactus", "Penguin", "Noodle", "Muffin", "Dolphin", "Taco", "Unicorn"];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number

    return `${randomAdjective}${randomNoun}${randomNum}`;
  }

  // Generate a random token to store it in Redis with the email as key for password reset
  generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  // Validate the token sent by the user for password reset
  validateToken(email: string, token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      redisClient.get(`forgotPassword:${email}`, (err, storedToken) => {
        if (err) reject(err);
        resolve(storedToken === token);
      });
    });
  }

  // Generate a random 6-digit OTP
  generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Resend OTP to the user's email
  async resendOtp(email: string): Promise<void> {
    const existingData = await redisClient.get(`otp:${email}`);
    if (!existingData)
      throw new CustomError(
        "OTP expired or not found. Please register again.",
        StatusCodes.BAD_REQUEST
      );

    const newOtp = this.generateOTP();

    await this.sendOtpEmail(email, newOtp);
  }

  // Send OTP to the user's email for verification
  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const expirationTime = "10 minutes";
    const data = JSON.stringify({ otp });

    await redisClient.setex(`otp:${email}`, expirationTime, data);

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
      // await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending OTP email:", error);
      throw new CustomError(
        "Failed to send OTP. Please try again later.",
        StatusCodes.BAD_REQUEST
      );
    }

    console.log(email, otp);
  }

  // Create a reset password link with token
  async sendResetEmailWithToken(email: string): Promise<void> {
    const token = this.generateToken();
    const expirationTime = 15 * 60;

    await redisClient.setex(`forgotPassword:${email}`, expirationTime, token);

    const resetLink = `${CLIENT_URL}/login/reset-password?token=${token}&email=${email}`;

    await this.sendResetEmail(email, resetLink);
  }

  // Send password reset link to the user
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
      throw new CustomError("Failed to send OTP. Please try again later.");
    }
  }

  // Check if a user with the given email exists
  async findUserByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !!user;
  }

  // Verify OTP and retrieve stored user data
  async verifyAndRetrieveUser(email: string, otp: string): Promise<RegisterDto> {
    const storedData = await redisClient.get(`otp:${email}`);

    if (!storedData)
      throw new CustomError("OTP expired or invalid.", StatusCodes.BAD_REQUEST);

    const { userData, otp: storedOTP } = JSON.parse(storedData);

    if (otp !== storedOTP) throw new CustomError("Invalid OTP.", StatusCodes.BAD_REQUEST);

    return userData;
  }

  // Register a new user with the given details
  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const { name, email, password } = registerDto;
    const hashedPassword = await hash(password, 10);
    let username = this.generateUsername();
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await redisClient.del(`otp:${email}`);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      username,
    };
  }

  // Login a user with the given email and password
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findByEmail(email);

    if (!user)
      throw new CustomError("Invalid email or password", StatusCodes.BAD_REQUEST);

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid)
      throw new CustomError("Invalid password", StatusCodes.BAD_REQUEST);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      username: user.username,
      profilePic: user.profilePic,
    };
  }

  // Update the password of the user with the given email
  async updatePassword(email: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });
    if (!user) throw new CustomError("User not found", StatusCodes.NOT_FOUND);

    const hashedPassword = await hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    await redisClient.del(`forgotPassword:${email}`);
  }

  // Get a user by role and id from the database (used for token verification)
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

    const refreshToken = generateRefreshToken(data);

    const key = `refreshToken:${user._id}`;
    await redisClient.set(key, refreshToken, "EX", 7 * 24 * 60 * 60);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: "user",
      username: user.username,
    };
  }
}
