export interface ITokenService {
  generateToken(): string;
  validateToken(email: string, token: string): Promise<boolean>;
}
