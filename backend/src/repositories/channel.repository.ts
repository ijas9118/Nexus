import { BaseRepository } from '@/core/abstracts/base.repository';
import { IChannelRepository } from '@/core/interfaces/repositories/IChannelRepository';
import { ChannelData } from '@/core/types/service/create-channel';
import ChannelModel, { IChannel } from '@/models/channel.model';
import CustomError from '@/utils/CustomError';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import mongoose from 'mongoose';

@injectable()
export class ChannelRepository extends BaseRepository<IChannel> implements IChannelRepository {
  constructor() {
    super(ChannelModel);
  }

  createChannel = async (data: ChannelData): Promise<IChannel> => {
    const channelData: Partial<IChannel> = {
      name: data.name,
      members: data.members.map((memberId) => new mongoose.Types.ObjectId(memberId)),
      admin: new mongoose.Types.ObjectId(data.admin),
      messages: [],
    };

    const newChannel = await this.create(channelData);
    return newChannel;
  };

  getUserChannels = async (user: string): Promise<any[]> => {
    const userId = new mongoose.Types.ObjectId(user);

    const channels = await ChannelModel.aggregate([
      {
        $match: {
          $or: [{ admin: userId }, { members: userId }],
        },
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'messages',
          foreignField: '_id',
          as: 'messageDetails',
        },
      },
      {
        $unwind: {
          path: '$messageDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          'messageDetails.updatedAt': -1,
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          members: { $first: '$members' },
          admin: { $first: '$admin' },
          messages: { $first: '$messages' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          lastMessageTime: { $first: '$messageDetails.updatedAt' },
          lastMessageType: { $first: '$messageDetails.messageType' },
          lastMessageContent: { $first: '$messageDetails.content' },
          lastMessageFileUrl: { $first: '$messageDetails.fileUrl' },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          members: 1,
          admin: 1,
          messages: 1,
          createdAt: 1,
          updatedAt: 1,
          lastMessageTime: 1,
          lastMessageContent: {
            $cond: {
              if: { $eq: ['$lastMessageType', 'text'] },
              then: { $substr: ['$lastMessageContent', 0, 50] },
              else: {
                $cond: {
                  if: { $eq: ['$lastMessageType', 'file'] },
                  then: {
                    $cond: {
                      if: {
                        $regexMatch: {
                          input: '$lastMessageFileUrl',
                          regex: /\.(jpg|jpeg|png|gif)$/i,
                        },
                      },
                      then: 'Sent an image',
                      else: 'Sent a file',
                    },
                  },
                  else: '',
                },
              },
            },
          },
        },
      },
      {
        $sort: {
          lastMessageTime: -1,
          updatedAt: -1,
        },
      },
    ]);

    return channels;
  };

  getChannelMessages = async (channelId: string): Promise<any[]> => {
    const channelIdObj = new mongoose.Types.ObjectId(channelId);

    const channelMessages = await ChannelModel.findById(channelIdObj).populate({
      path: 'messages',
      populate: {
        path: 'sender',
        select: 'name profilePic _id email username',
      },
    });

    if (!channelMessages) {
      throw new CustomError('No Channel Found', StatusCodes.NOT_FOUND);
    }

    return channelMessages.messages;
  };
}
