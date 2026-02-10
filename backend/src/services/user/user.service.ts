import type { Express } from "express";

import bcrypt from "bcryptjs";
import { inject, injectable } from "inversify";

import type { IContentRepository } from "@/core/interfaces/repositories/i-content-repository";
import type { IUserRepository } from "@/core/interfaces/repositories/i-user-repository";
import type { IUserService } from "@/core/interfaces/services/i-user-service";
import type { IContent } from "@/models/content.model";
import type { ISquad } from "@/models/squads.model";
import type { IUser } from "@/models/user.model";

import { TYPES } from "@/di/types";
import { UsersResponseDTO } from "@/dtos/responses/admin/users.dto";
import { UserModel } from "@/models/user.model";
import { deleteFromCloudinary, uploadToCloudinary } from "@/utils/cloudinary-utils";

interface UserUpdateData {
  profilePic?: string;
  profilePicPublicId?: string;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ContentRepository) private contentRepo: IContentRepository,
  ) {}

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async getUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: UsersResponseDTO[]; total: number }> {
    const skip = (page - 1) * limit;
    const [usersRaw, total] = await Promise.all([
      this.userRepository.getAllUsers(skip, limit),
      UserModel.countDocuments({}),
    ]);

    const users = UsersResponseDTO.fromEntities(usersRaw);

    return { users, total };
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
    },
  ): Promise<boolean> {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      throw new Error("New password and confirm password do not match");
    }

    const user = await this.userRepository.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.userRepository.updateOne({ _id: userId }, { $set: { password: hashedPassword } });

    return true;
  }

  async updateProfilePic(
    userId: string,
    data: UserUpdateData,
    file?: Express.Multer.File,
  ): Promise<UserUpdateData> {
    if (file) {
      const { url, publicId } = await uploadToCloudinary(file, {
        baseFolder: "images",
        subFolder: "profile-pic",
        resourceType: "image",
      });

      const user = await this.userRepository.getUserById(userId);

      if (user?.profilePicPublicId) {
        await deleteFromCloudinary(user.profilePicPublicId);
      }

      data.profilePic = url;
      data.profilePicPublicId = publicId;
    }

    const updatedUser = await this.userRepository.updateUser(userId, data);
    if (!updatedUser)
      throw new Error("User not found");
    return data;
  }

  async deleteUser(userId: string): Promise<boolean> {
    return this.userRepository.deleteUser(userId);
  }

  async getUserJoinedSquads(userId: string): Promise<ISquad[]> {
    return this.userRepository.getUserJoinedSquads(userId);
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return this.userRepository.getUserByUsername(username);
  }

  getUserContents = async (username: string): Promise<IContent[] | null> => {
    const userId = await this.userRepository.getUserIdByUsername(username);
    if (!userId) {
      throw new Error("User not found");
    }

    const contents = await this.contentRepo.getUserContents(userId);

    return contents;
  };

  validateUsername = async (username: string): Promise<boolean> => {
    const user = await this.userRepository.findOne({ username });
    return !user;
  };
}
