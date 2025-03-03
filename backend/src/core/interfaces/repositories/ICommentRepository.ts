import { IComment } from "../../../models/comments.model";
import { AddCommentParams } from "../../types/Contet";

export interface ICommentRepository {
  createComment(commentData: AddCommentParams): Promise<IComment | null>;
  findCommentsByContentId(contentId: string): Promise<IComment[]>;
}
