import { IChannelController } from '@/core/interfaces/controllers/IChannelController';
import { IChannelService } from '@/core/interfaces/services/IChannelService';
import { TYPES } from '@/di/types';
import { ICreateChannelDTO } from '@/dtos/requests/channel.dto';
import CustomError from '@/utils/CustomError';
import { Request, Response } from 'express';
import asyncHanlder from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

@injectable()
export class ChannelController implements IChannelController {
  constructor(@inject(TYPES.ChannelService) private channelService: IChannelService) {}

  createChannel = asyncHanlder(async (req: Request, res: Response): Promise<void> => {
    const { name, members }: ICreateChannelDTO = req.body;
    const admin = req.user?._id as string;

    const channel = await this.channelService.createChannel({ name, members, admin });
    console.log(channel);

    res.status(StatusCodes.CREATED).json(channel);
  });

  getUserChannels = asyncHanlder(async (req: Request, res: Response): Promise<void> => {
    const user = req.user?._id as string;

    const channels = await this.channelService.getUserChannels(user);
    console.log(channels);

    res.status(StatusCodes.OK).json(channels);
  });

  getChannelMessages = asyncHanlder(async (req: Request, res: Response): Promise<void> => {
    const { channelId } = req.params;

    const messages = await this.channelService.getChannelMessages(channelId);

    res.status(StatusCodes.OK).json({ messages });
  });
}
