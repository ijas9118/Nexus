import mongoose from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { ICommentRepository } from "../core/interfaces/repositories/ICommentRepository";
import { AddCommentParams } from "../core/types/Contet";
import CommentModel, { IComment } from "../models/comments.model";
import { injectable } from "inversify";

@injectable()
export class CommentRepository
  extends BaseRepository<IComment>
  implements ICommentRepository
{
  constructor() {
    super(CommentModel);
  }

  createComment = async (commentData: AddCommentParams): Promise<IComment | null> => {
    console.log(commentData);
    const userId = new mongoose.Types.ObjectId(commentData.userId);
    const contentId = new mongoose.Types.ObjectId(commentData.contentId);

    const commentObj: any = {
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
      .populate("userId", "name profilePic")
      .populate({
        path: "replies",
        populate: { path: "userId", select: "name profilePic" },
      })
      .exec();
  };
}
