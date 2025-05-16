import { injectable } from 'inversify';
import { BaseRepository } from '../core/abstracts/base.repository';
import UserFollowModel, { IUserFollow } from '../models/followers.model';
import { Types } from 'mongoose';
import { IConnectionsRepository } from '../core/interfaces/repositories/IConnectionsRepository';
import { IPendingRequestUser, IUserWhoFollow, SearchConnections } from '../core/types/UserTypes';
import CustomError from '@/utils/CustomError';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '@/models/user.model';

@injectable()
export class ConnectionsRepository
  extends BaseRepository<IUserFollow>
  implements IConnectionsRepository
{
  constructor() {
    super(UserFollowModel);
  }

  searchConnections = async (userId: string, search: string): Promise<SearchConnections[]> => {
    const userFollow: IUserFollow = await this.model.findOne({ userId }).select('connections');
    if (!userFollow || !userFollow.connections.length) {
      throw new CustomError('No connections found', StatusCodes.NOT_FOUND);
    }

    const connectedUserIds = userFollow.connections;
    const results = await UserModel.find({
      _id: { $in: connectedUserIds },
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }).select('username name email profilePic');

    const formattedResults: SearchConnections[] = results.map((user) => ({
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      profilePic: user.profilePic,
      email: user.email,
    }));

    return formattedResults;
  };

  getPendingRequests = async (userId: string): Promise<IPendingRequestUser[]> => {
    const userObjId = new Types.ObjectId(userId);

    const pendingRequests = await UserFollowModel.aggregate([
      { $match: { userId: userObjId } },
      {
        $lookup: {
          from: 'users', // Collection name in MongoDB
          localField: 'pendingConnectionRequests', // Field in UserFollowModel
          foreignField: '_id', // _id in User collection
          as: 'pendingUsers', // Resulting array
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
  ): Promise<'ALREADY_SENT' | 'SUCCESS'> => {
    const requesterObjectId = new Types.ObjectId(requesterId);
    const recipientObjectId = new Types.ObjectId(recipientId);

    const existingRequest = await this.findOne({
      userId: recipientObjectId,
      pendingConnectionRequests: { $in: [requesterObjectId] },
    });

    if (existingRequest) {
      return 'ALREADY_SENT';
    }

    await this.findOneAndUpdate(
      { userId: recipientObjectId },
      { $addToSet: { pendingConnectionRequests: requesterObjectId } }
    );

    return 'SUCCESS';
  };

  acceptConnectionRequest = async (userId: string, requesterId: string): Promise<boolean> => {
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

  hasSentConnectionRequest = async (requesterId: string, recipientId: string): Promise<boolean> => {
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

  getAllConnections = async (userId: string): Promise<any[]> => {
    const connections = await UserFollowModel.findOne({ userId })
      .populate<{ connections: IUserWhoFollow[] }>('connections', 'name profilePic')
      .lean();

    return (
      connections?.connections.map((connection) => ({
        label: connection.name,
        value: connection._id,
      })) || []
    );
  };
}
