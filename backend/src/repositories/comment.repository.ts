import mongoose from 'mongoose';
import { BaseRepository } from '../core/abstracts/base.repository';
import { ICommentRepository } from '../core/interfaces/repositories/ICommentRepository';
import { AddCommentParams } from '../core/types/service/add-comment';
import CommentModel, { IComment } from '../models/comments.model';
import { injectable } from 'inversify';
import { FormatTime } from '../utils/formatTime';

@injectable()
export class CommentRepository extends BaseRepository<IComment> implements ICommentRepository {
  constructor() {
    super(CommentModel);
  }

  createComment = async (commentData: AddCommentParams): Promise<IComment | null> => {
    console.log(commentData);
    const userId = new mongoose.Types.ObjectId(commentData.userId);
    const contentId = new mongoose.Types.ObjectId(commentData.contentId);

    const commentObj: Partial<IComment> = {
      userId,
      contentId,
      text: commentData.text,
      ...(commentData.parentCommentId && {
        parentCommentId: new mongoose.Types.ObjectId(commentData.parentCommentId),
      }),
    };

    return this.create(commentObj);
  };

  findCommentsByContentId = async (contentId: string): Promise<IComment[]> => {
    return await CommentModel.find({ contentId, parentCommentId: null })
      .populate('userId', 'name profilePic')
      .populate({
        path: 'replies',
        populate: { path: 'userId', select: 'name profilePic' },
      })
      .exec();
  };

  getAllComments = async (): Promise<IComment[]> => {
    const comments = await CommentModel.find({})
      .populate('userId', 'name profilePic')
      .populate('contentId', 'title')
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
