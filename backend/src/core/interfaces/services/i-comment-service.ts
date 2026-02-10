import type { AddCommentParams } from "@/core/types/service/add-comment";
import type { IComment } from "@/models/social/comments.model";

export interface ICommentService {
  addComment: (commentData: AddCommentParams) => Promise<IComment>;
  getCommentsByContentId: (contentId: string) => Promise<IComment[]>;
  getAllComments: () => Promise<IComment[]>;
}
