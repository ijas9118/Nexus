import { injectable } from "inversify";
import { IUser } from "../models/user.model";
import User from "../models/user.model";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email });
  }

  async getAllUsers(): Promise<IUser[]> {
    return this.model.find();
  }

  async updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null> {
    return this.model.findByIdAndUpdate(userId, userData, { new: true });
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(userId);
    return result !== null;
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return this.model.findById(userId);
  }
}
