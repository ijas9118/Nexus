import { inject, injectable } from 'inversify';
import { BaseRepository } from '../core/abstracts/base.repository';
import { IContentRepository } from '../core/interfaces/repositories/IContentRepository';
import ContentModel, { IContent } from '../models/content.model';
import mongoose, { Types } from 'mongoose';
import { TYPES } from '../di/types';
import { IFollowersRepository } from '../core/interfaces/repositories/IFollowersRepository';
import UserFollowModel from '../models/followers.model';
import CustomError from '@/utils/CustomError';
import { StatusCodes } from 'http-status-codes';
import { IVoteRepository } from '@/core/interfaces/repositories/IVoteRepository';
import { UserRole } from '@/core/types/UserTypes';

@injectable()
export class ContentRepository extends BaseRepository<IContent> implements IContentRepository {
  constructor(
    @inject(TYPES.FollowersRepository) private followersRepository: IFollowersRepository,
    @inject(TYPES.VoteRepository) private voteRepo: IVoteRepository
  ) {
    super(ContentModel);
  }

  async findContent(id: string, role: UserRole, userId?: string): Promise<any> {
    const contentIdObj = new Types.ObjectId(id);

    const result = (await this.model
      .findById(contentIdObj)
      .populate('squad', 'name')
      .populate('author', 'name profilePic role username')
      .lean()) as IContent & { isUpvoted?: boolean; isDownvoted?: boolean };

    if (!result) {
      return null;
    }

    if (result.isPremium && role === 'user') {
      throw new CustomError(
        'This content is available for premium members only',
        StatusCodes.PAYMENT_REQUIRED
      );
    }

    if (userId) {
      const vote = await this.voteRepo.findOne({
        contentId: contentIdObj,
        userId: new Types.ObjectId(userId),
      });

      result.isUpvoted = vote?.voteType === 'upvote' || false;
      result.isDownvoted = vote?.voteType === 'downvote' || false;
    } else {
      result.isUpvoted = false;
      result.isDownvoted = false;
    }

    return result;
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
          from: 'users', // Users collection
          localField: 'author', // Content author field
          foreignField: '_id', // User _id field
          as: 'authorInfo',
        },
      },
      {
        $unwind: '$authorInfo', // Convert array to object
      },
      {
        $lookup: {
          from: 'votes',
          let: { contentId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$contentId', '$$contentId'] },
                    { $eq: ['$userId', userObjectId] },
                  ],
                },
              },
            },
          ],
          as: 'userVote',
        },
      },
      {
        $lookup: {
          from: 'bookmarks',
          let: { contentId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$contentId', '$contentIds'] },
                    { $eq: ['$userId', userObjectId] },
                  ],
                },
              },
            },
          ],
          as: 'userBookmark',
        },
      },
      {
        $lookup: {
          from: 'squads', // Squads collection
          localField: 'squad', // Content's squad field
          foreignField: '_id', // Squad _id field
          as: 'squadInfo',
        },
      },
      {
        $unwind: {
          path: '$squadInfo',
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
                        input: '$userVote',
                        as: 'vote',
                        cond: { $eq: ['$$vote.voteType', 'upvote'] },
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
                        input: '$userVote',
                        as: 'vote',
                        cond: { $eq: ['$$vote.voteType', 'downvote'] },
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
          isBookmarked: { $gt: [{ $size: '$userBookmark' }, 0] },
          username: '$authorInfo.username',
          profilePic: '$authorInfo.profilePic',
          squad: {
            _id: '$squadInfo._id',
            name: '$squadInfo.name',
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

  async getPosts(): Promise<IContent[]> {
    return await ContentModel.find({}).populate('author', 'name profilePic');
  }

  async verifyContent(contentId: string): Promise<IContent | null> {
    const contentIdObj = new mongoose.Types.ObjectId(contentId);
    return await this.findByIdAndUpdate(contentIdObj, { isVerified: true });
  }

  async getFollowingUsersContents(userId: string): Promise<IContent[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const userFollow = await UserFollowModel.findOne({ userId: userObjectId }).exec();

    if (!userFollow) {
      throw new Error('User follow document not found');
    }

    const followingUserIds = userFollow.following.map((id) => new mongoose.Types.ObjectId(id));

    const contents = await ContentModel.find({ author: { $in: followingUserIds } })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .populate('author', 'name profilePic') // Populate author details
      .populate('squad', 'name') // Populate squad details
      .exec();

    return contents;
  }

  getUserContents = async (userId: string): Promise<IContent[] | null> => {
    return this.model
      .find({ author: userId })
      .populate('author', 'name profilePic username')
      .populate('squad', 'name')
      .exec();
  };

  incrementViewCount = async (contentId: string): Promise<void> => {
    await this.model.findByIdAndUpdate(contentId, { $inc: { viewCount: 1 } });
  };
}
