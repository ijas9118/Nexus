import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IContentRepository } from "../core/interfaces/repositories/IContentRepository";
import ContentModel, { IContent } from "../models/content.model";
import mongoose, { Types } from "mongoose";

@injectable()
export class ContentRepository
  extends BaseRepository<IContent>
  implements IContentRepository
{
  constructor() {
    super(ContentModel);
  }

  async findContent(id: string): Promise<IContent | null> {
    const contentIdObj = new Types.ObjectId(id);
    return await ContentModel.findById(contentIdObj).populate("squad", "name");
  }

  async getFeedContents(userId: string): Promise<IContent[]> {
    const userObjectId = new Types.ObjectId(userId);

    const contents = await this.model.aggregate([
      {
        $lookup: {
          from: "users", // Users collection
          localField: "author", // Content author field
          foreignField: "_id", // User _id field
          as: "authorInfo",
        },
      },
      {
        $unwind: "$authorInfo", // Convert array to object
      },
      {
        $lookup: {
          from: "likes",
          let: { contentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$contentId", "$$contentId"] },
                    { $eq: ["$userId", userObjectId] },
                  ],
                },
              },
            },
          ],
          as: "userLike",
        },
      },
      {
        $lookup: {
          from: "bookmarks",
          let: { contentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$$contentId", "$contentIds"] },
                    { $eq: ["$userId", userObjectId] },
                  ],
                },
              },
            },
          ],
          as: "userBookmark",
        },
      },
      {
        $addFields: {
          isLiked: { $gt: [{ $size: "$userLike" }, 0] },
          isBookmarked: { $gt: [{ $size: "$userBookmark" }, 0] },
          username: "$authorInfo.username",
        },
      },
      {
        $project: {
          userLike: 0,
          userBookmark: 0,
          authorInfo: 0,
          __v: 0,
        },
      },
    ]);

    return contents;
  }

  async getPosts(): Promise<IContent[]> {
    return await ContentModel.find({}).populate("author", "name profilePic");
  }

  async verifyContent(contentId: string): Promise<IContent | null> {
    const contentIdObj = new mongoose.Types.ObjectId(contentId);
    return await this.findByIdAndUpdate(contentIdObj, { isVerified: true });
  }
}
