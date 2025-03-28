import mongoose from 'mongoose';
import { BaseRepository } from '../core/abstracts/base.repository';
import { IMessageRepository } from '../core/interfaces/repositories/IMessageRepository';
import MessageModel, { IMessage } from '../models/message.model';
import { injectable } from 'inversify';

@injectable()
export class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {
  constructor() {
    super(MessageModel);
  }

  getUsersWithChats = async (userId: string): Promise<any[]> => {
    const userIdObj = new mongoose.Types.ObjectId(userId);

    const chats = await MessageModel.aggregate([
      {
        $match: {
          $or: [{ sender: userIdObj }, { recipient: userIdObj }],
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', userIdObj] },
              then: '$recipient',
              else: '$sender',
            },
          },
          lastMessageTime: { $first: '$updatedAt' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $unwind: '$userInfo',
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: '$userInfo.email',
          username: '$userInfo.username',
          name: '$userInfo.name',
          profilePic: '$userInfo.profilePic',
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return chats;
  };

  getAllMessages = async (user1: string, user2: string): Promise<IMessage[]> => {
    const messages = await this.model
      .find({
        $or: [
          {
            sender: user1,
            recipient: user2,
          },
          {
            sender: user2,
            recipient: user1,
          },
        ],
      })
      .sort({ updatedAt: 1 });
    return messages;
  };
}
