import { RequestHandler } from 'express';

export interface IChannelController {
  createChannel: RequestHandler;
  getUserChannels: RequestHandler;
}
