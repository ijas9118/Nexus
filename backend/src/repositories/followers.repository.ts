import { Types } from 'mongoose';
import { BaseRepository } from '../core/abstracts/base.repository';
import { IFollowersRepository } from '../core/interfaces/repositories/IFollowersRepository';
import UserFollowModel, { IUserFollow } from '../models/followers.model';
import { injectable } from 'inversify';
import { IUserWhoFollow } from '../core/types/UserTypes';

@injectable()
export class FollowersRepository
  extends BaseRepository<IUserFollow>
  implements IFollowersRepository
{
  constructor() {
    super(UserFollowModel);
  }

  followUser = async (followerId: string, followedId: string): Promise<boolean> => {
    const followerObjectId = new Types.ObjectId(followerId);
    const followedObjectId = new Types.ObjectId(followedId);
    console.log(followerObjectId, followedObjectId);

    const existingFollow = await this.findOne({
      userId: followerObjectId,
      following: { $in: [followedObjectId] },
    });

    if (existingFollow) {
      return false;
    }

    await this.findOneAndUpdate(
      { userId: followerObjectId },
      { $addToSet: { following: followedObjectId } }
    );

    await this.findOneAndUpdate(
      { userId: followedObjectId },
      { $addToSet: { followers: followerObjectId } }
    );

    return true;
  };

  unfollowUser = async (followerId: string, followedId: string): Promise<boolean> => {
    const followerObjectId = new Types.ObjectId(followerId);
    const followedObjectId = new Types.ObjectId(followedId);

    await this.findOneAndUpdate(
      { userId: followerObjectId },
      { $pull: { following: followedObjectId } }
    );

    await this.findOneAndUpdate(
      { userId: followedObjectId },
      { $pull: { followers: followerObjectId } }
    );

    return true;
  };

  getFollowers = async (userId: string): Promise<IUserWhoFollow[]> => {
    const userFollow = await UserFollowModel.findOne({ userId })
      .populate<{ followers: IUserWhoFollow[] }>('followers', 'name profilePic')
      .lean();
    return userFollow?.followers || [];
  };

  getFollowing = async (userId: string): Promise<IUserWhoFollow[]> => {
    const userFollow = await UserFollowModel.findOne({ userId })
      .populate<{ following: IUserWhoFollow[] }>('following', 'name profilePic')
      .lean();
    return userFollow?.following || [];
  };

  isFollowing = async (followerId: string, followedId: string): Promise<boolean> => {
    const userFollow = await this.findOne({
      userId: followerId,
      following: followedId,
    });

    return !!userFollow;
  };
}
