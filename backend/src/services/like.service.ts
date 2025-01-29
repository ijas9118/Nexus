import { ILikeService } from "../core/interfaces/services/ILikeService";
import { ContentRepository } from "../repositories/content.repository";
import { LikesRepository } from "../repositories/likes.repository";
import { ILike } from "../models/likes.model";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";

@injectable()
export class LikeService implements ILikeService {
  constructor(
    @inject(TYPES.LikesRepository) private likesRepository: LikesRepository,
    @inject(TYPES.ContentRepository) private contentRepository: ContentRepository
  ) {}

  async toggleLike(
    contentId: string,
    userId: string
  ): Promise<{ status: boolean; likeCount: number | undefined }> {
    const content = await this.contentRepository.findById(contentId);
    if (!content) throw new Error("Content not found");

    const existingLike = await this.likesRepository.findOne({ contentId, userId });

    if (existingLike) {
      await this.likesRepository.deleteOne({ contentId, userId });
      await this.contentRepository.updateOne({ _id: contentId }, { $inc: { likes: -1 } });
    } else {
      await this.likesRepository.create({ contentId, userId });
      await this.contentRepository.updateOne({ _id: contentId }, { $inc: { likes: 1 } });
    }

    const updatedContent = await this.contentRepository.findById(contentId);

    return {
      status: existingLike ? false : true,
      likeCount: updatedContent?.likes,
    };
  }

  async getLikedContentsId(userId: string): Promise<Set<string>> {
    const likedContents = await this.likesRepository.getLikedContentByUser(userId);
    const likedContentIds = new Set(
      likedContents.map((like) => like.contentId.toString())
    );
    return likedContentIds;
  }
}
