import { inject, injectable } from "inversify";
import { IContentService } from "../core/interfaces/services/IContentService";
import { TYPES } from "../di/types";
import { IContent } from "../models/content.model";
import { BaseService } from "../core/abstracts/base.service";
import { ContentRepository } from "../repositories/content.repository";

@injectable()
export class ContentService extends BaseService<IContent> implements IContentService {
  constructor(
    @inject(TYPES.ContentRepository) private contentRepository: ContentRepository
  ) {
    super(contentRepository);
  }

  async createContent(contentData: Partial<IContent>): Promise<IContent> {
    return this.create(contentData);
  }

  async getContentById(id: string): Promise<IContent | null> {
    return this.contentRepository.findContent(id);
  }

  async getAllContent(userId: string): Promise<IContent[]> {
    return this.contentRepository.getFeedContents(userId);
  }
}
