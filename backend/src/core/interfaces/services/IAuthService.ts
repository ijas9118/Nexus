import { LoginDto } from '../../../dtos/requests/login.dto';
import { RegisterDto } from '../../../dtos/requests/register.dto';
import { LoginResponseDto } from '../../../dtos/responses/auth/loginResponse.dto';
import { RegisterResponseDto } from '../../../dtos/responses/auth/registerResponse.dto';
import { IUser } from '../../../models/user.model';

export interface IAuthService {
  findUserByEmail(email: string): Promise<boolean>;
  register(registerDto: RegisterDto): Promise<RegisterResponseDto>;
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
