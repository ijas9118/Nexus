import { Types } from "mongoose";
import { ILikeService } from "../core/interfaces/services/ILikeService";
import { ContentRepository } from "../repositories/content.repository";
import { LikesRepository } from "../repositories/likes.repository";
import { ILike } from "../models/likes.model";

export class LikeService implements ILikeService {
  constructor(
    private likesRepository: LikesRepository,
    private contentRepository: ContentRepository
  ) {}

  async toggleLike(
    contentId: string,
    userId: string
  ): Promise<{ status: "liked" | "unliked" }> {
    const content = await this.contentRepository.findById(contentId);
    if (!content) throw new Error("Content not found");

    const existingLike = await this.likesRepository.findOne({ contentId, userId });

    if (existingLike) {
      await this.likesRepository.deleteOne({ contentId, userId });
      return { status: "unliked" };
    } else {
      await this.likesRepository.create({ contentId, userId });
      return { status: "liked" };
    }
  }

  async getLikesByContent(contentId: string): Promise<ILike[]> {
    const content = await this.contentRepository.findById(contentId);
    if (!content) throw new Error("Content not found");

    return await this.likesRepository.find({ contentId });
  }
}
