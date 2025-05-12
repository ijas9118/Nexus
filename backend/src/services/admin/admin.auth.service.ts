import { compare } from 'bcryptjs';
import { LoginDto } from '../../dtos/requests/login.dto';
import { LoginResponseDto } from '../../dtos/responses/auth/loginResponse.dto';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { IAdminRepository } from '../../core/interfaces/repositories/IAdminRepository';
import { UserRole } from '@/core/types/global/user-role';

@injectable()
export class AdminAuthService {
  constructor(@inject(TYPES.AdminRepository) private adminRepository: IAdminRepository) {}

  async findUserByEmail(email: string): Promise<boolean> {
    const user = await this.adminRepository.findByEmail(email);
    return !!user;
  }

  async login(loginDto: LoginDto): Promise<{
    _id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null> {
    const { email, password } = loginDto;
    const user = await this.adminRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
    };
  }
}
