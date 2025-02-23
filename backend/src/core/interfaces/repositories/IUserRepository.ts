import { IUser } from "../../../models/user.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IUserRepository extends BaseRepository<IUser> {
  getUserJoinedSquads(userId: string): Promise<string[]>;
  findByEmail(email: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  getUserById(userId: string): Promise<IUser | null>;
  addPostCount(userId: string): Promise<IUser | null>;
  deleteUser(userId: string): Promise<boolean>;
}
