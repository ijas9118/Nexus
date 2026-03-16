import type { Express } from "express";

import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IContentRepository } from "@/core/interfaces/repositories/i-content-repository";
import type { IUserRepository } from "@/core/interfaces/repositories/i-user-repository";
import type { IContentService } from "@/core/interfaces/services/i-content-service";
import type { IContentViewService } from "@/core/interfaces/services/i-content-view-service";
import type { IHistoryService } from "@/core/interfaces/services/i-history-service";
import type { ISubscriptionService } from "@/core/interfaces/services/i-subscription-service";
import type { UserRole } from "@/core/types/user-types";
import type { IContent } from "@/models/content/content.model";

import { TYPES } from "@/di/types";
import { uploadToCloudinary } from "@/utils/cloudinary-utils";
import CustomError from "@/utils/custom-error";

@injectable()
export class ContentService implements IContentService {
  constructor(
    @inject(TYPES.ContentRepository) private _contentRepository: IContentRepository,
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.ContentViewService) private _viewService: IContentViewService,
    @inject(TYPES.HistoryService) private _historyService: IHistoryService,
    @inject(TYPES.SubscriptionService) private _subscriptionService: ISubscriptionService,
  ) {}

  async createContent(
    contentData: any,
    thumbnailFile?: Express.Multer.File,
    videoFile?: Express.Multer.File,
    user?: { _id: string; name: string },
  ): Promise<IContent> {
    let thumbnailUrl: string | undefined;
    let videoUrl: string | undefined;

    if (thumbnailFile) {
      const result = await uploadToCloudinary(thumbnailFile, {
        baseFolder: "images",
        subFolder: "blog-thumbnails",
        resourceType: "image",
      });
      thumbnailUrl = result.url;
    }

    if (videoFile) {
      const result = await uploadToCloudinary(videoFile, {
        baseFolder: "videos",
        subFolder: "content-videos",
        resourceType: "video",
      });
      videoUrl = result.url;
    }

    const reshapedContentData = {
      ...contentData,
      author: user?._id || contentData.author,
      userName: user?.name || contentData.userName,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      thumbnailUrl,
      videoUrl,
    };

    const createdContent = await this._contentRepository.create(reshapedContentData);

    if (createdContent.author) {
      await this._userRepository.addPostCount(createdContent.author.toString());
    }

    return createdContent;
  }

  async getContentById(id: string, role: UserRole, userId: string): Promise<IContent | null> {
    const content = await this._contentRepository.findContent(id, role, userId);

    if (content) {
      if (content.isPremium) {
        const isAuthorized = await this._isUserAuthorizedForPremium(userId, role);
        if (!isAuthorized) {
          throw new CustomError("Premium subscription required", StatusCodes.FORBIDDEN);
        }
      }

      if (userId) {
        await this._viewService.handleContentView(userId, id);

        if (role === "user") {
          await this._historyService.addHistory(userId, id);
        }
      }
    }

    return content;
  }

  async getAllContent(
    userId: string,
    role: UserRole,
    page: number,
    limit: number,
  ): Promise<{ contents: IContent[]; nextPage: number | null }> {
    const contents = await this._contentRepository.getFeedContents(userId, page, limit);
    const gatedContents = await this._gateContentItems(contents, userId, role);

    const totalContents = await this.getContentCount();
    const nextPage = page * limit < totalContents ? page + 1 : null;

    return { contents: gatedContents, nextPage };
  }

  async getContentCount(): Promise<number> {
    return this._contentRepository.getContentCount();
  }

  async getPosts(): Promise<IContent[]> {
    return this._contentRepository.getPosts();
  }

  async verifyContent(contentId: string): Promise<IContent | null> {
    return this._contentRepository.verifyContent(contentId);
  }

  async getFollowingUsersContents(userId: string): Promise<IContent[]> {
    const role = (await this._userRepository.findById(userId))?.role || "user";
    const contents = await this._contentRepository.getFollowingUsersContents(userId);
    return this._gateContentItems(contents, userId, role as UserRole);
  }

  async getUserContents(userId: string): Promise<IContent[]> {
    const role = (await this._userRepository.findById(userId))?.role || "user";
    const contents = await this._contentRepository.getUserContents(userId);
    return this._gateContentItems(contents, userId, role as UserRole);
  }

  private async _isUserAuthorizedForPremium(userId: string, role: UserRole): Promise<boolean> {
    if (role === "admin" || role === "mentor")
      return true;
    if (role !== "premium")
      return false;

    const activeSubscription = await this._subscriptionService.getUserActiveSubscription(userId);
    return !!activeSubscription && new Date(activeSubscription.endDate) > new Date();
  }

  private async _gateContentItems(
    contents: IContent[],
    userId: string,
    role: UserRole,
  ): Promise<IContent[]> {
    const isAuthorized = await this._isUserAuthorizedForPremium(userId, role);

    return contents.map((content) => {
      if (content.isPremium && !isAuthorized) {
        return {
          ...content,
          content: content.content ? `${content.content.substring(0, 150)}...` : "",
          videoUrl: "", // Mask video URL too
        } as IContent;
      }
      return content;
    });
  }
}
