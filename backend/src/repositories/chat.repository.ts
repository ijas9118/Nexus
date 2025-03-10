import mongoose from 'mongoose';
import { BaseRepository } from '../core/abstracts/base.repository';
import { IChatRepository } from '../core/interfaces/repositories/IChatRepository';
import ChatModel, { IChat } from '../models/chat.model';
import { injectable } from 'inversify';
import { FormatTime } from '../utils/formatTime';

@injectable()
export class ChatRepository extends BaseRepository<IChat> implements IChatRepository {
  constructor() {
    super(ChatModel);
  }

  createNewChat(members: string[]): Promise<IChat> {
    const objectIdMembers = members.map((member) => new mongoose.Types.ObjectId(member));
    return this.create({ members: objectIdMembers });
  }

  async getAllChats(userId: string): Promise<IChat[]> {
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const chats = await ChatModel.aggregate([
      {
        $match: {
          members: { $in: [objectIdUserId] },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'members',
          foreignField: '_id',
          as: 'members',
        },
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'lastMessageDetails',
        },
      },
      {
        $unwind: {
          path: '$lastMessageDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          member: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$members',
                  as: 'member',
                  cond: { $ne: ['$$member._id', objectIdUserId] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          userId: '$member._id',
          name: '$member.name',
          username: '$member.username',
          avatar: '$member.profilePic',
          lastMessage: '$lastMessageDetails.text',
          lastMessageTime: '$lastMessageDetails.updatedAt',
          unreadMessages: 1,
        },
      },
    ]);

    const formattedChats = chats.map((chat) => {
      if (chat.lastMessageTime) {
        chat.lastMessageTime = FormatTime.formatTime(chat.lastMessageTime);
      }
      return chat;
    });

    return formattedChats;
  }
}
