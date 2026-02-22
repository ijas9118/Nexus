import type { Express } from "express";

import type { UsersResponseDTO } from "@/dtos/responses/admin/users.dto";
import type { IContent } from "@/models/content/content.model";
import type { ISquad } from "@/models/social/squads.model";
import type { IUser } from "@/models/user/user.model";

export interface IUserService {
  findByEmail: (email: string) => Promise<IUser | null>;
  getUsers: (
    page: number,
    limit: number,
  ) => Promise<{
    users: UsersResponseDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  getUserById: (userId: string) => Promise<IUser | null>;
  updateUser: (userId: string, userData: Partial<IUser>) => Promise<IUser | null>;
  updatePassword: (
    userId: string,
    passwordData: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
  ) => Promise<boolean>;
  updateProfilePic: (
    userId: string,
    data: any,
    file?: Express.Multer.File,
  ) => Promise<any>;
  deleteUser: (userId: string) => Promise<boolean>;
  getUserJoinedSquads: (userId: string) => Promise<ISquad[]>;
  getUserByUsername: (username: string) => Promise<IUser | null>;
  getUserContents: (username: string) => Promise<IContent[]>;
  validateUsername: (username: string) => Promise<boolean>;
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
}
