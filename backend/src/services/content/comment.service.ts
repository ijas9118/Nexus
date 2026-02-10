import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { ICommentRepository } from "@/core/interfaces/repositories/i-comment-repository";
import type { ICommentService } from "@/core/interfaces/services/i-comment-service";
import type { AddCommentParams } from "@/core/types/service/add-comment";
import type { IComment } from "@/models/social/comments.model";

import { TYPES } from "@/di/types";
import CustomError from "@/utils/custom-error";

@injectable()
export class CommentService implements ICommentService {
  constructor(@inject(TYPES.CommentRepository) private commentRepository: ICommentRepository) {}

  addComment = async (commentData: AddCommentParams): Promise<IComment> => {
    const comment = await this.commentRepository.createComment(commentData);
    if (!comment) {
      throw new CustomError("Failed to create comment", StatusCodes.INTERNAL_SERVER_ERROR);
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
