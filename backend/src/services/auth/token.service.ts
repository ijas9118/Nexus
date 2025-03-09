import { injectable } from 'inversify';
import crypto from 'crypto';
import redisClient from '../../config/redisClient.config';
import { ITokenService } from '../../core/interfaces/services/ITokenService';

@injectable()
export class TokenService implements ITokenService {
  // Generate a random token to store it in Redis with the email as key for password reset
  generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Validate the token sent by the user for password reset
  validateToken(email: string, token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      redisClient.get(`forgotPassword:${email}`, (err, storedToken) => {
        if (err) {reject(err);}
        resolve(storedToken === token);
      });
    });
  }
}
