import { IComment } from '../../../models/comments.model';
import { AddCommentParams } from '../../types/service/add-comment';

export interface ICommentRepository {
  createComment(commentData: AddCommentParams): Promise<IComment | null>;
  findCommentsByContentId(contentId: string): Promise<IComment[]>;
  getAllComments(): Promise<IComment[]>;
}
