import { inject, injectable } from "inversify";
import { IContentService } from "../core/interfaces/services/IContentService";
import { TYPES } from "../di/types";
import { IContent } from "../models/content.model";
import { BaseService } from "../core/abstracts/base.service";
import { ContentRepository } from "../repositories/content.repository";
import { UserRepository } from "../repositories/user.repository";

@injectable()
export class ContentService extends BaseService<IContent> implements IContentService {
  constructor(
    @inject(TYPES.ContentRepository) private contentRepository: ContentRepository,
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {
    super(contentRepository);
  }

  async createContent(contentData: Partial<IContent>): Promise<IContent> {
    const createdContent = await this.create(contentData);

    if (createdContent.author) {
      await this.userRepository.updateUser(createdContent.author.toString(), {
        $inc: { postsCount: 1 },
      });
    }

    return createdContent;
  }

  async getContentById(id: string): Promise<IContent | null> {
    return this.contentRepository.findContent(id);
  }

  async getAllContent(userId: string): Promise<IContent[]> {
    return this.contentRepository.getFeedContents(userId);
  }
}
