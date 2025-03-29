import { IChannelController } from '@/core/interfaces/controllers/IChannelController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import { Router } from 'express';

const router = Router();

const channelController = container.get<IChannelController>(TYPES.ChannelController);

router.post(
  '/create-channel',
  authenticate(['user', 'mentor', 'premium']),
  channelController.createChannel
);

router.get(
  '/get-user-channels',
  authenticate(['user', 'mentor', 'premium']),
  channelController.getUserChannels
);

export default router;
