export interface IEmailService {
  sendOtpEmail(email: string, otp: string): Promise<void>;
  sendResetEmail(email: string, resetLink: string): Promise<void>;
  sendResetEmailWithToken(email: string): Promise<void>;
}
