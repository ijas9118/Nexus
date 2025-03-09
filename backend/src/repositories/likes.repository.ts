import { DeleteResult, Types } from 'mongoose';
import { BaseRepository } from '../core/abstracts/base.repository';
import { ILikesRepository } from '../core/interfaces/repositories/ILikesRepository';
import { ILike, LikeModel } from '../models/likes.model';
import { injectable } from 'inversify';

@injectable()
export class LikesRepository extends BaseRepository<ILike> implements ILikesRepository {
  constructor() {
    super(LikeModel);
  }

  async createLike(contentId: string, userId: string): Promise<ILike> {
    const userIdObj = new Types.ObjectId(userId);
    const contentIdObj = new Types.ObjectId(contentId);

    return await this.create({ contentId: contentIdObj, userId: userIdObj });
  }

  async deleteLike(contentId: string, userId: string): Promise<DeleteResult> {
    const userIdObj = new Types.ObjectId(userId);
    const contentIdObj = new Types.ObjectId(contentId);

    return await this.deleteOne({ contentId: contentIdObj, userId: userIdObj });
  }

  async getLikedContentByUser(userId: string): Promise<ILike[]> {
    return await this.find({ userId });
  }
}
