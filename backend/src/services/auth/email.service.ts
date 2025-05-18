import { inject, injectable } from 'inversify';
import redisClient from '../../config/redisClient.config';
import { CLIENT_URL, USER_EMAIL } from '../../utils/constants';
import CustomError from '../../utils/CustomError';
import { StatusCodes } from 'http-status-codes';
import { transporter } from '../../utils/nodemailerTransporter';
import { IEmailService } from '../../core/interfaces/services/IEmailService';
import { TYPES } from '../../di/types';
import { ITokenService } from '../../core/interfaces/services/ITokenService';
import { RegisterRequestDTO } from '@/dtos/requests/auth.dto';
import logger from '@/config/logger';

@injectable()
export class EmailService implements IEmailService {
  constructor(@inject(TYPES.TokenService) private tokenService: ITokenService) {}

  // Send OTP to the user's email for verification
  async sendOtpEmail(userData: RegisterRequestDTO, otp: string): Promise<void> {
    const expirationTime = 10 * 60;
    const data = JSON.stringify({ userData, otp });

    await redisClient.setex(`otp:${userData.email}`, expirationTime, data);

    const mailOptions = {
      from: USER_EMAIL,
      to: userData.email,
      subject: 'Your OTP for Verification - Nexus',
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
      console.error('Error sending OTP email:', error);
      throw new CustomError('Failed to send OTP. Please try again later.', StatusCodes.BAD_REQUEST);
    }

    logger.debug(userData.email, otp);
  }

  // Create a reset password link with token
  async sendResetEmailWithToken(email: string): Promise<void> {
    const token = this.tokenService.generateToken();
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
      subject: 'Password Reset Request - Nexus',
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
      console.error('Error sending OTP email:', error);
      throw new CustomError('Failed to send OTP. Please try again later.');
    }
  }
}
