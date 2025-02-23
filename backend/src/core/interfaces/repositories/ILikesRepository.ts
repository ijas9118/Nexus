import { ILike } from "../../../models/likes.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface ILikesRepository extends BaseRepository<ILike> {
  createLike(contentId: string, userId: string): unknown;
  deleteLike(contentId: string, userId: string): unknown;
  getLikedContentByUser(userId: string): Promise<ILike[]>;
}
