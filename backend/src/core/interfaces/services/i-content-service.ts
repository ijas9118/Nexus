import type { Express } from "express";

import type { UserRole } from "@/core/types/user-types";

import type { IContent } from "../../../models/content.model";

export interface IContentService {
  createContent: (
    contentData: Partial<IContent>,
    thumbnailFile?: Express.Multer.File,
    videoFile?: Express.Multer.File,
  ) => Promise<IContent>;
  getContentById: (id: string, role: UserRole, userId: string) => Promise<IContent | null>;
  getAllContent: (userId: string, page: number, limit: number) => Promise<IContent[]>;
  getPosts: () => Promise<IContent[]>;
  verifyContent: (contentId: string) => Promise<IContent | null>;
  getFollowingUsersContents: (userId: string) => Promise<IContent[]>;
  getContentCount: () => Promise<number>;
}
