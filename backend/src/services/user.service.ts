import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { IUserService } from "../core/interfaces/services/IUserService";
import { IUser } from "../models/user.model";
import { BaseService } from "../core/abstracts/base.service";
import { UsersDTO } from "../dtos/responses/admin/users.dto";
import bcrypt from "bcrypt";

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

  async updatePassword(
    userId: string,
    passwordData: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }
  ): Promise<boolean> {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      throw new Error("New password and confirm password do not match");
    }

    // Fetch the user from the database
    const user = await this.userRepository.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    // Validate current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    await this.userRepository.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } }
    );

    return true;
  }

  async deleteUser(userId: string): Promise<boolean> {
    return this.userRepository.deleteUser(userId);
  }

  async getUserJoinedSquads(userId: string): Promise<string[]> {
    return this.userRepository.getUserJoinedSquads(userId);
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return this.userRepository.findOne({ username });
  }
}
