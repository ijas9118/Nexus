import { Types } from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IFollowersRepository } from "../core/interfaces/repositories/IFollowersRepository";
import UserFollowModel, { IUserFollow } from "../models/followers.model";
import { injectable } from "inversify";

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

  getFollowers = async (userId: string): Promise<any[]> => {
    const userFollow = await UserFollowModel.findOne({ userId })
      .populate("followers", "name profilePic")
      .lean();
    return userFollow?.followers || [];
  };

  getFollowing = async (userId: string): Promise<any[]> => {
    const userFollow = await UserFollowModel.findOne({ userId })
      .populate("following", "name profilePic")
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

  getAllConnections = async (userId: string) => {
    const userObjId = new Types.ObjectId(userId);

    const connections = await UserFollowModel.aggregate([
      { $match: { userId: userObjId } },
      {
        $lookup: {
          from: "users",
          localField: "connections",
          foreignField: "_id",
          as: "connectedUsers",
        },
      },
      {
        $project: {
          _id: 0,
          connectedUsers: {
            _id: 1,
            name: 1,
            username: 1,
            profilePic: 1,
          },
        },
      },
    ]);

    return connections.length > 0 ? connections[0].connectedUsers : [];
  };

  getPendingRequests = async (
    userId: string
  ): Promise<
    { _id: Types.ObjectId; name: string; username: string; profilePic: string }[]
  > => {
    const userObjId = new Types.ObjectId(userId);

    const pendingRequests = await UserFollowModel.aggregate([
      { $match: { userId: userObjId } },
      {
        $lookup: {
          from: "users", // Collection name in MongoDB
          localField: "pendingConnectionRequests", // Field in UserFollowModel
          foreignField: "_id", // _id in User collection
          as: "pendingUsers", // Resulting array
        },
      },
      {
        $project: {
          _id: 0, // Exclude the parent document ID
          pendingUsers: {
            _id: 1,
            name: 1,
            username: 1,
            profilePic: 1,
          },
        },
      },
    ]);

    return pendingRequests.length > 0 ? pendingRequests[0].pendingUsers : [];
  };

  sendConnectionRequest = async (
    requesterId: string,
    recipientId: string
  ): Promise<boolean> => {
    const requesterObjectId = new Types.ObjectId(requesterId);
    const recipientObjectId = new Types.ObjectId(recipientId);

    const existingRequest = await this.findOne({
      userId: recipientObjectId,
      pendingConnectionRequests: { $in: [requesterObjectId] },
    });

    if (existingRequest) {
      return false;
    }

    await this.findOneAndUpdate(
      { userId: recipientObjectId },
      { $addToSet: { pendingConnectionRequests: requesterObjectId } }
    );

    return true;
  };

  acceptConnectionRequest = async (
    userId: string,
    requesterId: string
  ): Promise<boolean> => {
    const userObjectId = new Types.ObjectId(userId);
    const requesterObjectId = new Types.ObjectId(requesterId);

    console.log(userObjectId, requesterObjectId);

    await this.findOneAndUpdate(
      { userId: userObjectId },
      {
        $pull: { pendingConnectionRequests: requesterObjectId },
        $addToSet: { connections: requesterObjectId },
      }
    );

    // await this.findOneAndUpdate(
    //   { userId: recipientObjectId },
    //   { $addToSet: { connections: requesterObjectId } }
    // );

    await this.findOneAndUpdate(
      { userId: requesterObjectId },
      { $addToSet: { connections: userId } }
    );

    return true;
  };

  hasSentConnectionRequest = async (
    requesterId: string,
    recipientId: string
  ): Promise<boolean> => {
    const requesterObjectId = new Types.ObjectId(requesterId);
    const recipientObjectId = new Types.ObjectId(recipientId);

    const recipientUser = await this.findOne({
      userId: recipientObjectId,
      pendingConnectionRequests: { $in: [requesterObjectId] },
    });

    return !!recipientUser;
  };

  withdrawConnectionRequest = async (
    requesterId: string,
    recipientId: string
  ): Promise<boolean> => {
    const requesterObjectId = new Types.ObjectId(requesterId);
    const recipientObjectId = new Types.ObjectId(recipientId);

    await this.findOneAndUpdate(
      { userId: recipientObjectId },
      { $pull: { pendingConnectionRequests: requesterObjectId } }
    );

    return true;
  };
}
