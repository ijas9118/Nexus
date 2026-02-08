import type { LoginRequestDTO, RegisterRequestDTO } from "@/dtos/requests/auth.dto";
import type { LoginResponseDTO, RegisterResponseDTO } from "@/dtos/responses/auth.dto";

import type { IUser } from "../../../models/user.model";

export interface IAuthService {
  findUserByEmail: (email: string) => Promise<boolean>;
  register: (registerDto: RegisterRequestDTO) => Promise<RegisterResponseDTO>;
  login: (loginDto: LoginRequestDTO) => Promise<LoginResponseDTO>;
  updatePassword: (email: string, newPassword: string) => Promise<void>;
  isUserBlocked: (userId: string) => Promise<boolean>;
  getUserByRoleAndId: (role: string, id: string) => Promise<IUser | null>;
  handleGoogleUser: (googleData: {
    googleId: string;
    email: string;
    name: string;
    profile: string;
  }) => Promise<IUser>;
  handleGithubUser: (githubData: {
    githubId: string;
    email: string;
    name: string;
    profile: string;
  }) => Promise<IUser>;
}
