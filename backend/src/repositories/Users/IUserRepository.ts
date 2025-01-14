import { IUser } from "../../interfaces/IUser";

export interface IUserRepository {
  createUser(userData: Partial<IUser>): Promise<IUser>;
}
