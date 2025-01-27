import { ILike } from "../../../models/likes.model";

export interface ILikeService {
  toggleLike(
    contentId: string,
    userId: string
  ): Promise<{ status: "liked" | "unliked" }>;
  getLikesByContent(contentId: string): Promise<ILike[]>;
}
