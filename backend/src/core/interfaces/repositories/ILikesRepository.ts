import { ILike } from "../../../models/likes.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface ILikesRepository extends BaseRepository<ILike> {
  getLikedContentByUser(userId: string): Promise<ILike[]>;
}
