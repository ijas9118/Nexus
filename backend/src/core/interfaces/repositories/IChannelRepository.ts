import { ChannelData } from '@/core/types/service/create-channel';
import { IChannel } from '@/models/channel.model';

export interface IChannelRepository {
  createChannel(data: ChannelData): Promise<IChannel>;
  getUserChannels(user: string): Promise<IChannel[]>;
  getChannelMessages(channelId: string): Promise<any[]>;
}
