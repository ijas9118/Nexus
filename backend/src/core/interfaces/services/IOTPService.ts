import { RegisterDto } from '../../../dtos/requests/register.dto';

export interface IOTPService {
  generateOTP(): string;
  resendOtp(email: string): Promise<void>;
  verifyAndRetrieveUser(email: string, otp: string): Promise<RegisterDto>;
}
