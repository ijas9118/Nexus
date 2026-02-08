import { compare } from 'bcryptjs';
import { inject, injectable } from 'inversify';

import type { UserRole } from '@/core/types/user-types';
import type { LoginRequestDTO } from '@/dtos/requests/auth.dto';

import type { IAdminRepository } from '../../core/interfaces/repositories/i-admin-repository';

import { TYPES } from '../../di/types';

@injectable()
export class AdminAuthService {
  constructor(@inject(TYPES.AdminRepository) private adminRepository: IAdminRepository) {}

  async findUserByEmail(email: string): Promise<boolean> {
    const user = await this.adminRepository.findByEmail(email);
    return !!user;
  }

  async login(loginDto: LoginRequestDTO): Promise<{
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
