import { inject, injectable } from "inversify";

import type { ICommentRepository } from "@/core/interfaces/repositories/i-comment-repository";
import type { IContentRepository } from "@/core/interfaces/repositories/i-content-repository";
import type { AddCommentParams } from "@/core/types/service/add-comment";
import type { IComment } from "@/models/social/comments.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { TYPES } from "@/di/types";
import CommentModel from "@/models/social/comments.model";
import { FormatTime } from "@/utils/format-time";

@injectable()
export class CommentRepository extends BaseRepository<IComment> implements ICommentRepository {
  constructor(@inject(TYPES.ContentRepository) private _contentRepository: IContentRepository) {
    super(CommentModel);
  }

  createComment = async (commentData: AddCommentParams): Promise<IComment | null> => {
    const commentObj: Partial<IComment> = {
      userId: commentData.userId,
      contentId: commentData.contentId,
      text: commentData.text,
      ...(commentData.parentCommentId && {
        parentCommentId: commentData.parentCommentId,
      }),
    };

    const newComment = await this.create(commentObj);

    if (commentData.parentCommentId) {
      await CommentModel.findByIdAndUpdate(commentData.parentCommentId, {
        $push: { replies: newComment._id },
      });
      await this._contentRepository.updateOne(
        { _id: commentData.contentId },
        { $inc: { commentCount: 1 } },
      );
    }
    else {
      await this._contentRepository.updateOne(
        { _id: commentData.contentId },
        { $inc: { commentCount: 1 } },
      );
    }

    return newComment;
  };

  findCommentsByContentId = async (contentId: string): Promise<IComment[]> => {
    return await CommentModel.find({ contentId, parentCommentId: null })
      .populate("userId", "name profilePic username")
      .populate({
        path: "replies",
        populate: {
          path: "userId",
          select: "name profilePic username",
        },
      })
      .lean()
      .exec();
  };

  getAllComments = async (): Promise<IComment[]> => {
    const comments = await CommentModel.find({})
      .populate("userId", "name profilePic")
      .populate("contentId", "title")
      .sort({ createdAt: -1 });

    const formattedComment = comments.map((comment: IComment) => {
      return {
        ...comment.toObject(),
        updatedAt: FormatTime.formatTime(comment.updatedAt?.toISOString()),
      };
    });
    return formattedComment;
  };
}
