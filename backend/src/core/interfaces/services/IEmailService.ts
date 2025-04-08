import { RegisterDto } from '@/dtos/requests/register.dto';

export interface IEmailService {
  sendOtpEmail(userData: RegisterDto, otp: string): Promise<void>;
  sendResetEmail(email: string, resetLink: string): Promise<void>;
  sendResetEmailWithToken(email: string): Promise<void>;
}
