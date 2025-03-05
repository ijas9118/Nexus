import { IComment } from '../../../models/comments.model';
import { AddCommentParams } from '../../types/Contet';

export interface ICommentService {
  addComment(commentData: AddCommentParams): Promise<IComment>;
  getCommentsByContentId(contentId: string): Promise<IComment[]>;
  getAllComments(): Promise<IComment[]>;
}
