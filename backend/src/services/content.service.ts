import { inject, injectable } from 'inversify';
import { IContentService } from '../core/interfaces/services/IContentService';
import { TYPES } from '../di/types';
import { IContent } from '../models/content.model';
import { IContentRepository } from '../core/interfaces/repositories/IContentRepository';
import { IUserRepository } from '../core/interfaces/repositories/IUserRepository';
import { IContentViewService } from '@/core/interfaces/services/IContentViewService';
import { Express } from 'express';
import { uploadToCloudinary } from '@/utils/cloudinaryUtils';

@injectable()
export class ContentService implements IContentService {
  constructor(
    @inject(TYPES.ContentRepository) private contentRepository: IContentRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ContentViewService) private viewService: IContentViewService
  ) {}

  async createContent(
    contentData: Partial<IContent>,
    thumbnailFile?: Express.Multer.File,
    videoFile?: Express.Multer.File
  ): Promise<IContent> {
    let thumbnailUrl: string | undefined;
    let videoUrl: string | undefined;

    // Upload thumbnail to Cloudinary if provided
    if (thumbnailFile) {
      const result = await uploadToCloudinary(thumbnailFile, {
        baseFolder: 'images',
        subFolder: 'blog-thumbnails',
        resourceType: 'image',
      });
      thumbnailUrl = result.url;
    }

    // Upload video to Cloudinary if provided
    if (videoFile) {
      const result = await uploadToCloudinary(videoFile, {
        baseFolder: 'videos',
        subFolder: 'content-videos',
        resourceType: 'video',
      });
      videoUrl = result.url;
    }

    // Update contentData with Cloudinary URLs
    const updatedContentData = {
      ...contentData,
      thumbnailUrl,
      videoUrl,
    };

    // Save content to the database
    const createdContent = await this.contentRepository.create(updatedContentData);

    // Increment author's post count
    if (createdContent.author) {
      await this.userRepository.addPostCount(createdContent.author.toString());
    }

    return createdContent;
  }

  async getContentById(id: string, role: string, userId: string): Promise<IContent | null> {
    const content = await this.contentRepository.findContent(id, role, userId);

    if (content && userId) {
      await this.viewService.handleContentView(userId, id);
    }

    return content;
  }

  async getAllContent(userId: string, page: number, limit: number): Promise<IContent[]> {
    return this.contentRepository.getFeedContents(userId, page, limit);
  }

  async getContentCount(): Promise<number> {
    return this.contentRepository.getContentCount();
  }

  async getPosts(): Promise<IContent[]> {
    return this.contentRepository.getPosts();
  }

  async verifyContent(contentId: string): Promise<IContent | null> {
    return this.contentRepository.verifyContent(contentId);
  }

  async getFollowingUsersContents(userId: string): Promise<IContent[]> {
    return this.contentRepository.getFollowingUsersContents(userId);
  }
}
