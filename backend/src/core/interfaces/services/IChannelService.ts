import { ChannelData } from '@/core/types/service/create-channel';
import { IChannel } from '@/models/channel.model';
import { IMessage } from '@/models/message.model';

export interface IChannelService {
  createChannel(data: ChannelData): Promise<IChannel>;
  getUserChannels(user: string): Promise<IChannel[]>;
  getChannelMessages(channelId: string): Promise<any[]>;
}
