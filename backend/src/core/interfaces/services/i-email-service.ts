import type { RegisterRequestDTO } from '@/dtos/requests/auth.dto';

export interface IEmailService {
  sendOtpEmail: (userData: RegisterRequestDTO, otp: string) => Promise<void>;
  sendResetEmail: (email: string, resetLink: string) => Promise<void>;
  sendResetEmailWithToken: (email: string) => Promise<void>;
}
