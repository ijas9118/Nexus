import type { Express } from "express";

import type { UserRole } from "@/core/types/user-types";
import type { IContent } from "@/models/content/content.model";

export interface IContentService {
  createContent: (
    contentData: any,
    thumbnailFile?: Express.Multer.File,
    videoFile?: Express.Multer.File,
    user?: { _id: string; name: string },
  ) => Promise<IContent>;
  getContentById: (id: string, role: UserRole, userId: string) => Promise<IContent | null>;
  getAllContent: (
    userId: string,
    page: number,
    limit: number,
  ) => Promise<{ contents: IContent[]; nextPage: number | null }>;
  getContentCount: () => Promise<number>;
  getPosts: () => Promise<IContent[]>;
  verifyContent: (contentId: string) => Promise<IContent | null>;
  getFollowingUsersContents: (userId: string) => Promise<IContent[]>;
  getUserContents: (userId: string) => Promise<IContent[]>;
}
