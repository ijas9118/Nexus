import { injectable } from "inversify";
import { Types } from "mongoose";

import type { IFollowersRepository } from "@/core/interfaces/repositories/i-followers-repository";
import type { IUserWhoFollow } from "@/core/types/user-types";
import type { IUserFollow } from "@/models/social/followers.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import UserFollowModel from "@/models/social/followers.model";

@injectable()
export class FollowersRepository
  extends BaseRepository<IUserFollow>
  implements IFollowersRepository {
  constructor() {
    super(UserFollowModel);
  }

  followUser = async (followerId: string, followedId: string): Promise<boolean> => {
    const followerObjectId = new Types.ObjectId(followerId);
    const followedObjectId = new Types.ObjectId(followedId);

    const existingFollow = await this.findOne({
      userId: followerObjectId,
      following: { $in: [followedObjectId] },
    });

    if (existingFollow) {
      return false;
    }

    await this.findOneAndUpdate(
      { userId: followerObjectId },
      { $addToSet: { following: followedObjectId } },
    );

    await this.findOneAndUpdate(
      { userId: followedObjectId },
      { $addToSet: { followers: followerObjectId } },
    );

    return true;
  };

  unfollowUser = async (followerId: string, followedId: string): Promise<boolean> => {
    const followerObjectId = new Types.ObjectId(followerId);
    const followedObjectId = new Types.ObjectId(followedId);

    await this.findOneAndUpdate(
      { userId: followerObjectId },
      { $pull: { following: followedObjectId } },
    );

    await this.findOneAndUpdate(
      { userId: followedObjectId },
      { $pull: { followers: followerObjectId } },
    );

    return true;
  };

  getFollowers = async (
    userId: string, // the user whose followers you want
    currentUserId: string, // the currently logged-in user
  ): Promise<(IUserWhoFollow & { isFollowing: boolean })[]> => {
    const userFollow = await UserFollowModel.findOne({ userId })
      .populate<{ followers: IUserWhoFollow[] }>("followers", "name profilePic username")
      .lean();

    const followers = userFollow?.followers || [];

    // Get the following list of the current user
    const currentUserFollow = await UserFollowModel.findOne({ userId: currentUserId }).lean();

    const currentUserFollowingIds = new Set(
      currentUserFollow?.following.map((id: Types.ObjectId) => id.toString()) || [],
    );

    return followers.map(follower => ({
      ...follower,
      isFollowing: currentUserFollowingIds.has(follower._id.toString()),
    }));
  };

  getFollowing = async (userId: string): Promise<IUserWhoFollow[]> => {
    const userFollow = await UserFollowModel.findOne({ userId })
      .populate<{ following: IUserWhoFollow[] }>("following", "name profilePic username")
      .lean();
    return userFollow?.following || [];
  };

  getConnections = async (userId: string): Promise<IUserWhoFollow[]> => {
    const userFollow = await UserFollowModel.findOne({ userId })
      .populate<{ connections: IUserWhoFollow[] }>("connections", "name profilePic username")
      .lean();

    return userFollow?.connections || [];
  };

  isFollowing = async (followerId: string, followedId: string): Promise<boolean> => {
    const userFollow = await this.findOne({
      userId: followerId,
      following: followedId,
    });

    return !!userFollow;
  };

  getFollowStats = async (
    userId: string,
  ): Promise<{
    followersCount: number;
    followingCount: number;
    connectionsCount: number;
  }> => {
    const userFollow = await this.findOne({ userId });

    return {
      followersCount: userFollow?.followers?.length || 0,
      followingCount: userFollow?.following?.length || 0,
      connectionsCount: userFollow?.connections?.length || 0,
    };
  };
}
