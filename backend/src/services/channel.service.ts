import { IChannelRepository } from '@/core/interfaces/repositories/IChannelRepository';
import { IChannelService } from '@/core/interfaces/services/IChannelService';
import { ChannelData } from '@/core/types/service/create-channel';
import { TYPES } from '@/di/types';
import { IChannel } from '@/models/channel.model';
import { inject, injectable } from 'inversify';

@injectable()
export class ChannelService implements IChannelService {
  constructor(@inject(TYPES.ChannelRepository) private channelRepository: IChannelRepository) {}

  createChannel = async (data: ChannelData): Promise<IChannel> => {
    return await this.channelRepository.createChannel(data);
  };

  getUserChannels = async (user: string): Promise<IChannel[]> => {
    return await this.channelRepository.getUserChannels(user);
  };

  getChannelMessages = async (channelId: string): Promise<any[]> => {
    return await this.channelRepository.getChannelMessages(channelId);
  };
}
