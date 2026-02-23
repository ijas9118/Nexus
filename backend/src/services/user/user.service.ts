import type { Express } from "express";

import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IContentRepository } from "@/core/interfaces/repositories/i-content-repository";
import type { IUserRepository } from "@/core/interfaces/repositories/i-user-repository";
import type { IUserService } from "@/core/interfaces/services/i-user-service";
import type { IContent } from "@/models/content/content.model";
import type { ISquad } from "@/models/social/squads.model";
import type { IUser } from "@/models/user/user.model";

import redisClient from "@/config/redis-client.config";
import { TYPES } from "@/di/types";
import { UsersResponseDTO } from "@/dtos/responses/admin/users.dto";
import { UserModel } from "@/models/user/user.model";
import { deleteFromCloudinary, uploadToCloudinary } from "@/utils/cloudinary-utils";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { USER_MESSAGES, ADMIN_MESSAGES } = MESSAGES;

interface UserUpdateData {
  profilePic?: string;
  profilePicPublicId?: string;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.ContentRepository) private _contentRepo: IContentRepository,
  ) {}

  async findByEmail(email: string): Promise<IUser | null> {
    return this._userRepository.findByEmail(email);
  }

  async getUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    users: UsersResponseDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [usersRaw, total] = await Promise.all([
      this._userRepository.getAllUsers(skip, limit),
      UserModel.countDocuments({}),
    ]);

    const users = UsersResponseDTO.fromEntities(usersRaw);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return this._userRepository.getUserById(userId);
  }

  async updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null> {
    return this._userRepository.updateUser(userId, userData);
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
      throw new CustomError(USER_MESSAGES.PASSWORD_MISMATCH, StatusCodes.BAD_REQUEST);
    }

    const user = await this._userRepository.findOne({ _id: userId });
    if (!user) {
      throw new CustomError(USER_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new CustomError(USER_MESSAGES.INCORRECT_PASSWORD, StatusCodes.BAD_REQUEST);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this._userRepository.updateOne({ _id: userId }, { $set: { password: hashedPassword } });

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

      const user = await this._userRepository.getUserById(userId);

      if (user?.profilePicPublicId) {
        await deleteFromCloudinary(user.profilePicPublicId);
      }

      data.profilePic = url;
      data.profilePicPublicId = publicId;
    }

    const updatedUser = await this._userRepository.updateUser(userId, data);
    if (!updatedUser) {
      throw new CustomError(USER_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return data;
  }

  async deleteUser(userId: string): Promise<boolean> {
    return this._userRepository.deleteUser(userId);
  }

  async getUserJoinedSquads(userId: string): Promise<ISquad[]> {
    return this._userRepository.getUserJoinedSquads(userId);
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return this._userRepository.getUserByUsername(username);
  }

  getUserContents = async (username: string): Promise<IContent[]> => {
    const userId = await this._userRepository.getUserIdByUsername(username);
    if (!userId) {
      throw new CustomError(USER_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    return this._contentRepo.getUserContents(userId);
  };

  validateUsername = async (username: string): Promise<boolean> => {
    const user = await this._userRepository.findOne({ username });
    return !user;
  };

  async blockUser(userId: string): Promise<boolean> {
    const updatedUser = await this._userRepository.updateUser(userId, { isBlocked: true });
    if (!updatedUser) {
      throw new CustomError(ADMIN_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    await redisClient.set(`blocked_user:${userId}`, 1, "EX", 7 * 24 * 60 * 60);
    return true;
  }

  async unblockUser(userId: string): Promise<boolean> {
    const updatedUser = await this._userRepository.updateUser(userId, { isBlocked: false });
    if (!updatedUser) {
      throw new CustomError(ADMIN_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    await redisClient.del(`blocked_user:${userId}`);
    return true;
  }
}
