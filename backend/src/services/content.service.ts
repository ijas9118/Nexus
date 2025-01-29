import { inject, injectable } from "inversify";
import { IContentRepository } from "../core/interfaces/repositories/IContentRepository";
import { IContentService } from "../core/interfaces/services/IContentService";
import { TYPES } from "../di/types";
import { IContent } from "../models/content.model";
import { BaseService } from "../core/abstracts/base.service";

@injectable()
export class ContentService extends BaseService<IContent> implements IContentService {
  constructor(
    @inject(TYPES.ContentRepository) private contentRepository: IContentRepository
  ) {
    super(contentRepository);
  }

  async createContent(contentData: Partial<IContent>): Promise<IContent> {
    return this.create(contentData);
  }

  async getContentById(id: string): Promise<IContent | null> {
    return this.findById(id);
  }

  async getAllContent(): Promise<IContent[]> {
    return this.contentRepository.findAll();
  }

}
