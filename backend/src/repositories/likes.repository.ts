import { ObjectId } from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { ILikesRepository } from "../core/interfaces/repositories/ILikesRepository";
import { ILike, LikeModel } from "../models/likes.model";

export class LikesRepository extends BaseRepository<ILike> implements ILikesRepository {
  constructor() {
    super(LikeModel);
  }

  async unlikeContent(contentId: ObjectId, userId: ObjectId): Promise<void> {
    const result = await this.model.findOneAndDelete({ contentId, userId });
    if (!result) throw new Error("Like not found for this user on this content");
    return;
  }

  async getLikesByContent(contentId: ObjectId): Promise<ILike[]> {
    return await this.find({ contentId });
  }
}
