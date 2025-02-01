import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { IUserService } from "../core/interfaces/services/IUserService";
import { IUser } from "../models/user.model";
import { BaseService } from "../core/abstracts/base.service";
import { UsersDTO } from "../dtos/responses/admin/users.dto";

@injectable()
export class UserService extends BaseService<IUser> implements IUserService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async getUsers(): Promise<UsersDTO[]> {
    const users = await this.userRepository.getAllUsers();
    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      postsCount: user.postsCount,
      joinedSquadsCount: user.joinedSquads.length,
    }));
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return this.userRepository.getUserById(userId);
  }

  async updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null> {
    return this.userRepository.updateUser(userId, userData);
  }

  async deleteUser(userId: string): Promise<boolean> {
    return this.userRepository.deleteUser(userId);
  }
}
