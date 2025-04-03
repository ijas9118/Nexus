import { ChannelData } from '@/core/types/service/create-channel';
import { IChannel } from '@/models/channel.model';

export interface IChannelService {
  createChannel(data: ChannelData): Promise<IChannel>;
  getUserChannels(user: string): Promise<IChannel[]>;
  getChannelMessages(channelId: string): Promise<any[]>;
  addMessageToChannel(channelId: string, messageId: string): Promise<void>;
  getChannelById(channelId: string): Promise<IChannel | null>;
}
