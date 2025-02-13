import { compare } from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.util";
import { LoginDto } from "../../dtos/requests/auth/login.dto";
import { LoginResponseDto } from "../../dtos/responses/auth/loginResponse.dto";
import redisClient from "../../config/redisClient.config";
import { AdminRepository } from "../../repositories/admin.repository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";

@injectable()
export class AdminAuthService {
  constructor(@inject(TYPES.AdminRepository) private adminRepository: AdminRepository) {}

  async findUserByEmail(email: string): Promise<boolean> {
    const user = await this.adminRepository.findByEmail(email);
    return !!user;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto | null> {
    const { email, password } = loginDto;
    const user = await this.adminRepository.findByEmail(email);

    if (!user) return null;

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) return null;

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
