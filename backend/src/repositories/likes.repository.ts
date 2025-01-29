import { ObjectId } from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { ILikesRepository } from "../core/interfaces/repositories/ILikesRepository";
import { ILike, LikeModel } from "../models/likes.model";
import { injectable } from "inversify";

@injectable()
export class LikesRepository extends BaseRepository<ILike> implements ILikesRepository {
  constructor() {
    super(LikeModel);
  }
  async getLikedContentByUser(userId: string): Promise<ILike[]> {
    return await this.find({ userId });
  }
}
