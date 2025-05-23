import { IContent } from '@/models/content.model';
import { UsersResponseDTO } from '../../../dtos/responses/admin/users.dto';
import { ISquad } from '../../../models/squads.model';
import { IUser } from '../../../models/user.model';
import { Express } from 'express';

export interface IUserService {
  findByEmail(email: string): Promise<IUser | null>;
  getUsers(page: number, limit: number): Promise<{ users: UsersResponseDTO[]; total: number }>;
  getUserById(userId: string): Promise<IUser | null>;
  updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(userId: string): Promise<boolean>;
  getUserJoinedSquads(userId: string): Promise<ISquad[]>;
  getUserByUsername(username: string): Promise<IUser | null>;
  updatePassword(
    userId: string,
    passwordData: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }
  ): Promise<boolean>;

  updateProfilePic(userId: string, data: any, file?: Express.Multer.File): Promise<any>;
  getUserContents(username: string): Promise<IContent[] | null>;
  validateUsername(username: string): Promise<boolean>;
}
