import { injectable } from "inversify";
import mongoose from "mongoose";

import type { IBookmarkRepository } from "@/core/interfaces/repositories/i-bookmarn-repository";
import type { IBookmark } from "@/models/bookmarks.model";
import type { IContent } from "@/models/content.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { BookmarkModel } from "@/models/bookmarks.model";

@injectable()
export class BookmarkRepository extends BaseRepository<IBookmark> implements IBookmarkRepository {
  constructor() {
    super(BookmarkModel);
  }

  // Update bookmarked contents for a user by userId and contentIds
  async updateBookmark(
    userId: mongoose.Types.ObjectId,
    contentIds: mongoose.Types.ObjectId[],
  ): Promise<void> {
    await this.updateOne({ userId }, { contentIds });
  }

  async getBookmarks(userId: string): Promise<IContent[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const bookmarkedContents = await this.model.aggregate([
      { $match: { userId: userObjectId } },
      { $unwind: "$contentIds" },

      {
        $lookup: {
          from: "contents",
          localField: "contentIds",
          foreignField: "_id",
          as: "content",
        },
      },
      { $unwind: "$content" },

      // Replace root with the actual content document
      {
        $replaceRoot: { newRoot: "$content" },
      },

      // Join author info
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorInfo",
        },
      },
      { $unwind: "$authorInfo" },

      // Join vote info for current user
      {
        $lookup: {
          from: "votes",
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
          as: "userVote",
        },
      },

      // Join squad info (if any)
      {
        $lookup: {
          from: "squads",
          localField: "squad",
          foreignField: "_id",
          as: "squadInfo",
        },
      },
      {
        $unwind: {
          path: "$squadInfo",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Add computed fields
      {
        $addFields: {
          isUpvoted: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$userVote",
                    as: "vote",
                    cond: { $eq: ["$$vote.voteType", "upvote"] },
                  },
                },
              },
              0,
            ],
          },
          isDownvoted: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$userVote",
                    as: "vote",
                    cond: { $eq: ["$$vote.voteType", "downvote"] },
                  },
                },
              },
              0,
            ],
          },
          isBookmarked: true, // Always true in this context
          username: "$authorInfo.username",
          profilePic: "$authorInfo.profilePic",
          squad: {
            _id: "$squadInfo._id",
            name: "$squadInfo.name",
          },
        },
      },

      // Exclude unwanted fields
      {
        $project: {
          userVote: 0,
          authorInfo: 0,
          squadInfo: 0,
          __v: 0,
        },
      },
    ]);

    return bookmarkedContents;
  }
}
