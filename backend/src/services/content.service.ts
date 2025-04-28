import { inject, injectable } from 'inversify';
import { IContentService } from '../core/interfaces/services/IContentService';
import { TYPES } from '../di/types';
import { IContent } from '../models/content.model';
import { BaseService } from '../core/abstracts/base.service';
import { IContentRepository } from '../core/interfaces/repositories/IContentRepository';
import { IUserRepository } from '../core/interfaces/repositories/IUserRepository';

@injectable()
export class ContentService extends BaseService<IContent> implements IContentService {
  constructor(
    @inject(TYPES.ContentRepository) private contentRepository: IContentRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {
    super(contentRepository);
  }

  async createContent(contentData: Partial<IContent>): Promise<IContent> {
    const createdContent = await this.create(contentData);

    if (createdContent.author) {
      await this.userRepository.addPostCount(createdContent.author.toString());
    }

    return createdContent;
  }

  async getContentById(id: string, role: string, userId: string): Promise<IContent | null> {
    return this.contentRepository.findContent(id, role, userId);
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
