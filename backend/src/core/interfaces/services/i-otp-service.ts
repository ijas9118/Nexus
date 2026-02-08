import type { RegisterRequestDTO } from '@/dtos/requests/auth.dto';

export interface IOTPService {
  generateOTP: () => string;
  resendOtp: (email: string) => Promise<void>;
  verifyAndRetrieveUser: (email: string, otp: string) => Promise<RegisterRequestDTO>;
}
