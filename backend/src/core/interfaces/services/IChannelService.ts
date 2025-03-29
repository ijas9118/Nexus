import { ChannelData } from '@/core/types/service/create-channel';
import { IChannel } from '@/models/channel.model';

export interface IChannelService {
  createChannel(data: ChannelData): Promise<IChannel>;
  getUserChannels(user: string): Promise<IChannel[]>;
}
