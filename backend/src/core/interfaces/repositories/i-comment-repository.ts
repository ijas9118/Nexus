import type { AddCommentParams } from "@/core/types/service/add-comment";
import type { IComment } from "@/models/social/comments.model";

export interface ICommentRepository {
  createComment: (commentData: AddCommentParams) => Promise<IComment | null>;
  findCommentsByContentId: (contentId: string) => Promise<IComment[]>;
  getAllComments: () => Promise<IComment[]>;
}
