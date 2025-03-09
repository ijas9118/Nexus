import { ISquad } from '../../../models/squads.model';
import { IUser } from '../../../models/user.model';
import { BaseRepository } from '../../abstracts/base.repository';

export interface IUserRepository extends BaseRepository<IUser> {
  getUserJoinedSquads(userId: string): Promise<ISquad[]>;
  findByEmail(email: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  getUserById(userId: string): Promise<IUser | null>;
  addPostCount(userId: string): Promise<IUser | null>;
  deleteUser(userId: string): Promise<boolean>;
  updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null>;
  getUserByRoleAndId(role: string, id: string): Promise<IUser | null>;
}
