import { RegisterRequestDTO } from '@/dtos/requests/auth.dto';
import { LoginDto } from '../../../dtos/requests/login.dto';
import { LoginResponseDto } from '../../../dtos/responses/auth/loginResponse.dto';
import { IUser } from '../../../models/user.model';
import { RegisterResponseDTO } from '@/dtos/responses/auth.dto';

export interface IAuthService {
  findUserByEmail(email: string): Promise<boolean>;
  register(registerDto: RegisterRequestDTO): Promise<RegisterResponseDTO>;
  login(loginDto: LoginDto): Promise<LoginResponseDto>;
  updatePassword(email: string, newPassword: string): Promise<void>;
  getUserByRoleAndId(role: string, id: string): Promise<IUser | null>;
  handleGoogleUser(googleData: {
    googleId: string;
    email: string;
    name: string;
    profile: string;
  }): Promise<IUser>;
  handleGithubUser(githubData: {
    githubId: string;
    email: string;
    name: string;
    profile: string;
  }): Promise<IUser>;
}
