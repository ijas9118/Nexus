import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { IUserRepository } from '../core/interfaces/repositories/IUserRepository';
import { IUserService } from '../core/interfaces/services/IUserService';
import { IUser, UserModel } from '../models/user.model';
import { BaseService } from '../core/abstracts/base.service';
import { UsersDTO } from '../dtos/responses/admin/users.dto';
import bcrypt from 'bcrypt';
import { ISquad } from '../models/squads.model';
import { Express } from 'express';
import { deleteFromCloudinary, uploadToCloudinary } from '@/utils/cloudinaryUtils';

interface UserUpdateData {
  profilePic?: string;
  profilePicPublicId?: string;
}

@injectable()
export class UserService extends BaseService<IUser> implements IUserService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async getUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: UsersDTO[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userRepository.getAllUsers(skip, limit),
      UserModel.countDocuments({}),
    ]);

    const userDTOs = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      postsCount: user.postsCount,
      joinedSquadsCount: user.joinedSquads.length,
    }));

    return { users: userDTOs, total };
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

    if (newPassword !== confirmPassword) {
      throw new Error('New password and confirm password do not match');
    }

    const user = await this.userRepository.findOne({ _id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.userRepository.updateOne({ _id: userId }, { $set: { password: hashedPassword } });

    return true;
  }

  async updateProfilePic(
    userId: string,
    data: UserUpdateData,
    file?: Express.Multer.File
  ): Promise<UserUpdateData> {
    if (file) {
      const { url, publicId } = await uploadToCloudinary(file, {
        baseFolder: 'images',
        subFolder: 'profile-pic',
        resourceType: 'image',
      });

      const user = await this.userRepository.getUserById(userId);

      if (user?.profilePicPublicId) {
        await deleteFromCloudinary(user.profilePicPublicId);
      }

      data.profilePic = url;
      data.profilePicPublicId = publicId;
    }

    const updatedUser = await this.userRepository.updateUser(userId, data);
    if (!updatedUser) throw new Error('User not found');
    return data;
  }

  async deleteUser(userId: string): Promise<boolean> {
    return this.userRepository.deleteUser(userId);
  }

  async getUserJoinedSquads(userId: string): Promise<ISquad[]> {
    return this.userRepository.getUserJoinedSquads(userId);
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return this.userRepository.findOne({ username });
  }
}
