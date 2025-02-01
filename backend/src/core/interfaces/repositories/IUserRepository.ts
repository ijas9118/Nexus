import { IUser } from "../../../models/user.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IUserRepository extends BaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  getUserById(userId: string): Promise<IUser | null>;
  updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(userId: string): Promise<boolean>;
}
