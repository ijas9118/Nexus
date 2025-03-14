import { Router } from 'express';
import { validateRequest } from '@/middlewares/validate.middleware';
import { createChatSchema } from '@/validations/chat.schema';
import { IChatController } from '@/core/interfaces/controllers/IChatController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';

const chatController = container.get<IChatController>(TYPES.ChatController);

const router = Router();

router.post(
  '/create-new-chat',
  authenticate(['user']),
  validateRequest(createChatSchema),
  chatController.createChat
);

router.get('/get-all-chats', authenticate(['user']), chatController.getAllChats);

export default router;
