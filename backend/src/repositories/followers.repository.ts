import { Types } from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IFollowersRepository } from "../core/interfaces/repositories/IFollowersRepository";
import FollowersModel, { IFollower } from "../models/followers.model";
import { injectable } from "inversify";

@injectable()
export class FollowersRepository
  extends BaseRepository<IFollower>
  implements IFollowersRepository
{
  constructor() {
    super(FollowersModel);
  }

  followUser = async (
    followerId: string,
    followedId: string
  ): Promise<IFollower | null> => {
    const existingFollow = await this.findOne({ followerId, followedId });
    if (existingFollow) return null;

    return await this.create({
      followerId: new Types.ObjectId(followerId),
      followedId: new Types.ObjectId(followedId),
    });
  };

  unfollowUser = async (followerId: string, followedId: string): Promise<boolean> => {
    const result = await this.findOneAndDelete({ followerId, followedId });
    return !!result;
  };

  getFollowers = async (userId: string) => {
    return await this.model
      .find({ followedId: userId })
      .populate("followerId", "name profilePic");
  };

  getFollowing = async (userId: string) => {
    return await this.model
      .find({ followerId: userId })
      .populate("followedId", "name profilePic");
  };

  isFollowing = async (followerId: string, followedId: string): Promise<boolean> => {
    const follow = await this.findOne({ followerId, followedId });
    return !!follow;
  };
}
