import { Router } from 'express';
import { validateRequest } from '@/middlewares/validate.middleware';
import { createChatSchema, createNewMessageSchema } from '@/validations/chat.schema';
import { IChatController } from '@/core/interfaces/controllers/IChatController';
import { IMessageController } from '@/core/interfaces/controllers/IMessageController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';

const chatController = container.get<IChatController>(TYPES.ChatController);
const messageController = container.get<IMessageController>(TYPES.MessageController);

const router = Router();

router.post(
  '/create-new-chat',
  authenticate(['user']),
  validateRequest(createChatSchema),
  chatController.createChat
);

router.get('/get-all-chats', authenticate(['user']), chatController.getAllChats);

router.post(
  '/new-message',
  authenticate(['user']),
  validateRequest(createNewMessageSchema),
  messageController.createNewMessage
);

export default router;
