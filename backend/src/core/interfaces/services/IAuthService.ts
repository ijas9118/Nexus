import { LoginDto } from "../../../dtos/requests/auth/login.dto";
import { RegisterDto } from "../../../dtos/requests/auth/register.dto";
import { LoginResponseDto } from "../../../dtos/responses/auth/loginResponse.dto";
import { RegisterResponseDto } from "../../../dtos/responses/auth/registerResponse.dto";

export interface IAuthService {
  generateToken(): string;
  register(userData: any): Promise<RegisterResponseDto>;
  validateToken(email: string, token: string): Promise<boolean>;
  sendOtpEmail(email: string, otp: string): Promise<void>;
  sendResetEmail(email: string, resetLink: string): Promise<void>;
  generateOTP(): string;
  findUserByEmail(email: string): Promise<boolean>;
  register(registerDto: RegisterDto): Promise<RegisterResponseDto>;
  login(loginDto: LoginDto): Promise<LoginResponseDto | null>;
  updatePassword(email: string, newPassword: string): Promise<void>;
  getUserByRoleAndId(role: string, id: string): any;
}
