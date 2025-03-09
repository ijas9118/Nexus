import { UsersDTO } from '../../../dtos/responses/admin/users.dto';
import { IUser } from '../../../models/user.model';

export interface IUserService {
  findByEmail(email: string): Promise<IUser | null>;
  getUsers(): Promise<UsersDTO[]>;
  getUserById(userId: string): Promise<IUser | null>;
  updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(userId: string): Promise<boolean>;
  getUserJoinedSquads(userId: string): Promise<string[]>;
  getUserByUsername(username: string): Promise<IUser | null>;
  updatePassword(
    userId: string,
    passwordData: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }
  ): Promise<boolean>;
}
