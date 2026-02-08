import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import crypto from 'node:crypto';

import type { IEmailService } from '@/core/interfaces/services/i-email-service';
import type { IOTPService } from '@/core/interfaces/services/i-otp-service';
import type { RegisterRequestDTO } from '@/dtos/requests/auth.dto';

import logger from '@/config/logger';
import redisClient from '@/config/redis-client.config';
import { TYPES } from '@/di/types';
import CustomError from '@/utils/custom-error';

@injectable()
export class OTPService implements IOTPService {
  constructor(@inject(TYPES.EmailService) private emailService: IEmailService) {}

  // Generate a random 6-digit OTP
  generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Resend OTP to the user's email
  async resendOtp(email: string): Promise<void> {
    const existingData = JSON.parse((await redisClient.get(`otp:${email}`)) as string);
    if (!existingData) {
      throw new CustomError(
        'OTP expired or not found. Please register again.',
        StatusCodes.BAD_REQUEST
      );
    }

    const newOtp = this.generateOTP();

    await this.emailService.sendOtpEmail(existingData, newOtp);
  }

  // Verify OTP and retrieve stored user data
  async verifyAndRetrieveUser(email: string, otp: string): Promise<RegisterRequestDTO> {
    const storedData = await redisClient.get(`otp:${email}`);

    if (!storedData) {
      throw new CustomError('OTP expired or invalid.', StatusCodes.BAD_REQUEST);
    }

    const { userData, otp: storedOTP } = JSON.parse(storedData);

    logger.debug('User', userData, otp);

    if (otp !== storedOTP) {
      throw new CustomError('Invalid OTP.', StatusCodes.BAD_REQUEST);
    }

    return userData;
  }
}
