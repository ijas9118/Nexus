import { IUser } from "../../interfaces/IUser";
import { UserModel } from "../../models/UserModel";
import { IUserRepository } from "./IUserRepository";
import bcrypt from "bcryptjs";

export class UserRepository implements IUserRepository {
  async createUser(user: Partial<IUser>): Promise<IUser> {
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async comparePasswords(
    enteredPassword: string,
    storedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, storedPassword);
  }
}
