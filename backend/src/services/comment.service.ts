import { StatusCodes } from 'http-status-codes';
import { ICommentService } from '../core/interfaces/services/ICommentService';
import { IComment } from '../models/comments.model';
import CustomError from '../utils/CustomError';
import { ICommentRepository } from '../core/interfaces/repositories/ICommentRepository';
import { AddCommentParams } from '../core/types/service/add-comment';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';

@injectable()
export class CommentService implements ICommentService {
  constructor(@inject(TYPES.CommentRepository) private commentRepository: ICommentRepository) {}

  addComment = async (commentData: AddCommentParams): Promise<IComment> => {
    const comment = await this.commentRepository.createComment(commentData);
    if (!comment) {
      throw new CustomError('Failed to create comment', StatusCodes.INTERNAL_SERVER_ERROR);
    }
    return comment;
  };

  getCommentsByContentId = async (contentId: string): Promise<IComment[]> => {
    const comments = await this.commentRepository.findCommentsByContentId(contentId);
    return comments;
  };

  getAllComments = async (): Promise<IComment[]> => {
    return await this.commentRepository.getAllComments();
  };
}
