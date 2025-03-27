import { IMessageController } from '@/core/interfaces/controllers/IMessageController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import { Router } from 'express';

const messageController = container.get<IMessageController>(TYPES.MessageController);

const router = Router();

router.post('/get-messages/', authenticate(['user', 'premium']), messageController.getAllMessages);

router.get(
  '/get-users-with-chat',
  authenticate(['user', 'premium', 'mentor']),
  messageController.getUsersWithChats
);

export default router;
