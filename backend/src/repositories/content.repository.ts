import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import mongoose, { Types } from "mongoose";

import type { IVoteRepository } from "@/core/interfaces/repositories/i-vote-repository";
import type { SearchCriteria, SearchResultItem } from "@/core/types/search";
import type { UserRole } from "@/core/types/user-types";

import CustomError from "@/utils/custom-error";

import type { IContentRepository } from "../core/interfaces/repositories/i-content-repository";
import type { IFollowersRepository } from "../core/interfaces/repositories/i-followers-repository";
import type { IContent } from "../models/content.model";

import { BaseRepository } from "../core/abstracts/base.repository";
import { TYPES } from "../di/types";
import ContentModel from "../models/content.model";
import UserFollowModel from "../models/followers.model";

@injectable()
export class ContentRepository extends BaseRepository<IContent> implements IContentRepository {
  constructor(
    @inject(TYPES.FollowersRepository) private followersRepository: IFollowersRepository,
    @inject(TYPES.VoteRepository) private voteRepo: IVoteRepository,
  ) {
    super(ContentModel);
  }

  async countContents(): Promise<number> {
    return this.model.countDocuments({});
  }

  async countContentsBefore(date: Date): Promise<number> {
    return this.model.countDocuments({
      createdAt: { $lt: date },
    });
  }

  async findContent(id: string, role: UserRole, userId: string): Promise<IContent | null> {
    const contentId = new Types.ObjectId(id);
    const userObjectId = userId ? new Types.ObjectId(userId) : null;

    const pipeline: any[] = [
      { $match: { _id: contentId } },

      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorInfo",
        },
      },
      { $unwind: "$authorInfo" },

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

      ...(userId
        ? [
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
              $lookup: {
                from: "userfollows",
                let: { authorId: "$author" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$userId", userObjectId] },
                          { $in: ["$$authorId", "$following"] },
                        ],
                      },
                    },
                  },
                ],
                as: "isFollowingAuthor",
              },
            },
            {
              $lookup: {
                from: "userfollows",
                let: { authorId: "$author" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$userId", userObjectId] },
                          { $in: ["$$authorId", "$connections"] },
                        ],
                      },
                    },
                  },
                ],
                as: "isConnectedToAuthor",
              },
            },
          ]
        : []),

      {
        $addFields: {
          isUpvoted: {
            $cond: {
              if: {
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
              then: true,
              else: false,
            },
          },
          isDownvoted: {
            $cond: {
              if: {
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
              then: true,
              else: false,
            },
          },
          isBookmarked: { $gt: [{ $size: "$userBookmark" }, 0] },
          isFollowing: { $gt: [{ $size: "$isFollowingAuthor" }, 0] },
          isConnected: { $gt: [{ $size: "$isConnectedToAuthor" }, 0] },
          author: {
            _id: "$authorInfo._id",
            name: "$authorInfo.name",
            username: "$authorInfo.username",
            profilePic: "$authorInfo.profilePic",
            role: "$authorInfo.role",
          },
          squad: {
            _id: "$squadInfo._id",
            name: "$squadInfo.name",
          },
        },
      },
      {
        $project: {
          userVote: 0,
          userBookmark: 0,
          isFollowingAuthor: 0,
          isConnectedToAuthor: 0,
          authorInfo: 0,
          squadInfo: 0,
          __v: 0,
        },
      },
    ];

    const [content] = await this.model.aggregate(pipeline);

    if (!content) {
      return null;
    }

    if (content.isPremium && role === "user") {
      throw new CustomError(
        "This content is available for premium members only",
        StatusCodes.PAYMENT_REQUIRED,
      );
    }

    return content;
  }

  async getContentCount(): Promise<number> {
    return this.model.countDocuments({});
  }

  async getFeedContents(userId: string, page: number, limit: number): Promise<IContent[]> {
    const userObjectId = new Types.ObjectId(userId);

    const contents = await this.model.aggregate([
      { $sort: { createdAt: -1 } }, // Sort by latest
      { $skip: (page - 1) * limit }, // Skip items based on page
      { $limit: limit },
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
        $lookup: {
          from: "squads", // Squads collection
          localField: "squad", // Content's squad field
          foreignField: "_id", // Squad _id field
          as: "squadInfo",
        },
      },
      {
        $unwind: {
          path: "$squadInfo",
          preserveNullAndEmptyArrays: true, // If content has no squad, keep it null
        },
      },
      {
        $addFields: {
          isUpvoted: {
            $cond: {
              if: {
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
              then: true,
              else: false,
            },
          },
          isDownvoted: {
            $cond: {
              if: {
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
              then: true,
              else: false,
            },
          },
          isBookmarked: { $gt: [{ $size: "$userBookmark" }, 0] },
          username: "$authorInfo.username",
          profilePic: "$authorInfo.profilePic",
          squad: {
            _id: "$squadInfo._id",
            name: "$squadInfo.name",
          },
        },
      },
      {
        $project: {
          userVote: 0,
          userBookmark: 0,
          authorInfo: 0,
          squadInfo: 0,
          __v: 0,
        },
      },
    ]);

    return contents;
  }

  async getSquadContents(squadId: string, role: UserRole, userId: string): Promise<any[]> {
    const squadObjectId = new Types.ObjectId(squadId);
    const userObjectId = new Types.ObjectId(userId);

    const pipeline: any[] = [
      // Match contents for the given squad
      { $match: { squad: squadObjectId } },

      // Filter out premium content for non-premium users
      {
        $match: {
          $or: [
            { isPremium: false },
            { isPremium: true, $expr: { $in: [role, ["premium", "mentor", "admin"]] } },
          ],
        },
      },

      // Lookup author information
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorInfo",
        },
      },
      { $unwind: "$authorInfo" },

      // Lookup squad information
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

      // Lookup user-specific data (votes, bookmarks, following, connections)
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
        $lookup: {
          from: "userfollows",
          let: { authorId: "$author" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$userId", userObjectId] }, { $in: ["$$authorId", "$following"] }],
                },
              },
            },
          ],
          as: "isFollowingAuthor",
        },
      },
      {
        $lookup: {
          from: "userfollows",
          let: { authorId: "$author" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", userObjectId] },
                    { $in: ["$$authorId", "$connections"] },
                  ],
                },
              },
            },
          ],
          as: "isConnectedToAuthor",
        },
      },

      // Add fields for user-specific flags and formatted author/squad data
      {
        $addFields: {
          isUpvoted: {
            $cond: {
              if: {
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
              then: true,
              else: false,
            },
          },
          isDownvoted: {
            $cond: {
              if: {
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
              then: true,
              else: false,
            },
          },
          isBookmarked: { $gt: [{ $size: "$userBookmark" }, 0] },
          isFollowing: { $gt: [{ $size: "$isFollowingAuthor" }, 0] },
          isConnected: { $gt: [{ $size: "$isConnectedToAuthor" }, 0] },
          authorName: "$authorInfo.name",
          authorUsername: "$authorInfo.username",
          authorProfilePic: "$authorInfo.profilePic",
          authorRole: "$authorInfo.role",
          squad: "$squadInfo.name",
        },
      },

      // Project only the necessary fields
      {
        $project: {
          userVote: 0,
          userBookmark: 0,
          isFollowingAuthor: 0,
          isConnectedToAuthor: 0,
          authorInfo: 0,
          squadInfo: 0,
          __v: 0,
        },
      },

      // Sort by date (newest first)
      { $sort: { createdAt: -1 } },
    ];

    const contents = await this.model.aggregate(pipeline);

    return contents;
  }

  async getPosts(): Promise<IContent[]> {
    return await ContentModel.find({}).populate("author", "name profilePic");
  }

  async verifyContent(contentId: string): Promise<IContent | null> {
    const contentIdObj = new mongoose.Types.ObjectId(contentId);
    return await this.findByIdAndUpdate(contentIdObj, { isVerified: true });
  }

  async getFollowingUsersContents(userId: string): Promise<IContent[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the user's follow document
    const userFollow = await UserFollowModel.findOne({ userId: userObjectId }).exec();

    if (!userFollow) {
      throw new CustomError("User follow document not found", StatusCodes.NOT_FOUND);
    }

    const followingUserIds = userFollow.following.map(id => new mongoose.Types.ObjectId(id));

    const contents = await this.model.aggregate([
      // Match content from followed users
      {
        $match: {
          author: { $in: followingUserIds },
        },
      },
      // Sort by latest
      {
        $sort: { createdAt: -1 },
      },
      // Lookup author information
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorInfo",
        },
      },
      {
        $unwind: "$authorInfo",
      },
      // Lookup squad information
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
          preserveNullAndEmptyArrays: true, // Keep content without squad
        },
      },
      // Lookup user votes
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
      // Lookup user bookmarks
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
      // Add computed fields
      {
        $addFields: {
          isUpvoted: {
            $cond: {
              if: {
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
              then: true,
              else: false,
            },
          },
          isDownvoted: {
            $cond: {
              if: {
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
              then: true,
              else: false,
            },
          },
          isBookmarked: { $gt: [{ $size: "$userBookmark" }, 0] },
          name: "$authorInfo.name",
          username: "$authorInfo.username",
          profilePic: "$authorInfo.profilePic",
          userName: "$authorInfo.name",
          squad: {
            _id: "$squadInfo._id",
            name: "$squadInfo.name",
          },
        },
      },
      // Project final fields
      {
        $project: {
          userVote: 0,
          userBookmark: 0,
          authorInfo: 0,
          squadInfo: 0,
          __v: 0,
        },
      },
    ]);

    return contents;
  }

  getUserContents = async (userId: string): Promise<IContent[] | null> => {
    return this.model
      .find({ author: userId })
      .populate("author", "name profilePic username")
      .populate("squad", "name")
      .exec();
  };

  incrementViewCount = async (contentId: string): Promise<void> => {
    await this.model.findByIdAndUpdate(contentId, { $inc: { viewCount: 1 } });
  };

  async search(criteria: SearchCriteria): Promise<SearchResultItem[]> {
    const { query, limit = 10 } = criteria;

    if (!query)
      return [];

    const docs = await ContentModel.find(
      {
        contentType: "blog",
        $text: { $search: query },
      },
      { score: { $meta: "textScore" } },
    )
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .limit(limit)
      .lean();

    return docs.map(doc => ({
      id: doc._id.toString(),
      type: "blog",
      title: doc.title,
      snippet: doc.content.substring(0, 150), // example snippet
    }));
  }
}
