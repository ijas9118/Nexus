import { BaseRepository } from '@/core/abstracts/base.repository';
import { IChannelRepository } from '@/core/interfaces/repositories/IChannelRepository';
import { ChannelData } from '@/core/types/service/create-channel';
import ChannelModel, { IChannel } from '@/models/channel.model';
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

  getUserChannels = async (user: string): Promise<IChannel[]> => {
    const userId = new mongoose.Types.ObjectId(user);

    const channels = await ChannelModel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updateAt: -1 });
    return channels;
  };
}
