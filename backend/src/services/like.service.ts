import { ILikeService } from "../core/interfaces/services/ILikeService";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { ILikesRepository } from "../core/interfaces/repositories/ILikesRepository";
import { IContentRepository } from "../core/interfaces/repositories/IContentRepository";

@injectable()
export class LikeService implements ILikeService {
  constructor(
    @inject(TYPES.LikesRepository) private likesRepository: ILikesRepository,
    @inject(TYPES.ContentRepository) private contentRepository: IContentRepository
  ) {}

  async toggleLike(
    contentId: string,
    userId: string
  ): Promise<{ status: boolean; likeCount: number | undefined }> {
    const content = await this.contentRepository.findContent(contentId);
    if (!content) throw new Error("Content not found");

    const existingLike = await this.likesRepository.findOne({ contentId, userId });

    if (existingLike) {
      await this.likesRepository.deleteLike(contentId, userId);
      await this.contentRepository.updateOne({ _id: contentId }, { $inc: { likes: -1 } });
    } else {
      await this.likesRepository.createLike(contentId, userId);
      await this.contentRepository.updateOne({ _id: contentId }, { $inc: { likes: 1 } });
    }

    const updatedContent = await this.contentRepository.findContent(contentId);

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
