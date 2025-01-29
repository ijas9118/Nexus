import { ILike } from "../../../models/likes.model";
import { BaseRepository } from "../../abstracts/base.repository";
import { ObjectId } from "mongoose";

export interface ILikesRepository extends BaseRepository<ILike> {
  unlikeContent(contentId: ObjectId, userId: ObjectId): Promise<void>;
  getLikedContentByUser(userId: string): Promise<ILike[]>;
}
