import { IUser } from "../../interfaces/IUser";

export interface IUserRepository {
  createUser(userData: Partial<IUser>): Promise<IUser>;

  findUserByEmail(email: string): Promise<IUser | null>;

  comparePasswords(
    enteredPassword: string,
    storedPassword: string
  ): Promise<boolean>;
}
