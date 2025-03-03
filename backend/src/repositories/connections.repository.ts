import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import UserFollowModel, { IUserFollow } from "../models/followers.model";
import { Types } from "mongoose";
import { IConnectionsRepository } from "../core/interfaces/repositories/IConnectionsRepository";

@injectable()
export class ConnectionsRepository
  extends BaseRepository<IUserFollow>
  implements IConnectionsRepository
{
  constructor() {
    super(UserFollowModel);
  }

  getAllConnections = async (userId: string, search?: string) => {
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
      { $unwind: "$connectedUsers" }, // Flatten the connectedUsers array
      {
        $replaceRoot: { newRoot: "$connectedUsers" }, // Replace the root with connectedUsers
      },
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { name: { $regex: search, $options: "i" } }, // Case-insensitive search for name
                  { username: { $regex: search, $options: "i" } }, // Case-insensitive search for username
                ],
              },
            },
          ]
        : []),
      {
        $project: {
          _id: 1,
          name: 1,
          username: 1,
          avatar: "$profilePic",
        },
      },
    ]);

    return connections;
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

  isConnected = async (userId1: string, userId2: string): Promise<boolean> => {
    const userObjectId1 = new Types.ObjectId(userId1);
    const userObjectId2 = new Types.ObjectId(userId2);

    const user = await this.findOne({
      userId: userObjectId1,
      connections: { $in: [userObjectId2] },
    });

    return !!user;
  };
}
