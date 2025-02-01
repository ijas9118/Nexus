import { UsersDTO } from "../../../dtos/responses/admin/users.dto";
import { IUser } from "../../../models/user.model";
import { BaseService } from "../../abstracts/base.service";

export interface IUserService {
  findByEmail(email: string): Promise<IUser | null>;
  getUsers(): Promise<UsersDTO[]>;
  getUserById(userId: string): Promise<IUser | null>;
  updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(userId: string): Promise<boolean>;
}
