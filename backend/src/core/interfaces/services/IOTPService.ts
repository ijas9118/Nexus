import { RegisterDto } from '../../../dtos/requests/auth/register.dto';

export interface IOTPService {
  generateOTP(): string;
  resendOtp(email: string): Promise<void>;
  verifyAndRetrieveUser(email: string, otp: string): Promise<RegisterDto>;
}
