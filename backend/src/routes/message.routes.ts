import { IMessageController } from '@/core/interfaces/controllers/IMessageController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validate.middleware';
import { createNewMessageSchema } from '@/validations/chat.schema';
import { Router } from 'express';

const messageController = container.get<IMessageController>(TYPES.MessageController);

const router = Router();

router.post(
  '/new-message',
  authenticate(['user', 'premium']),
  validateRequest(createNewMessageSchema),
  messageController.createNewMessage
);

router.get(
  '/get-all-messages/:chatId',
  authenticate(['user', 'premium']),
  messageController.getAllMessages
);

export default router;
