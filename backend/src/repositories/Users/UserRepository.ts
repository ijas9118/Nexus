import { IUser } from "../../interfaces/IUser";
import { UserModel } from "../../models/userModel";
import { IUserRepository } from "./IUserRepository";

export class UserRepository implements IUserRepository {
  async createUser(user: Partial<IUser>): Promise<IUser> {
    const newUser = new UserModel(user);
    return await newUser.save();
  }
}
