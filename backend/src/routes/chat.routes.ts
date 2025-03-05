import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { container } from '../di/container';
import { TYPES } from '../di/types';
import { ChatController } from '../controllers/chat.controller';
import { MessageController } from '../controllers/message.controller';

const chatController = container.get<ChatController>(TYPES.ChatController);
const messageController = container.get<MessageController>(TYPES.MessageController);

const router = Router();

router.post('/create-new-chat', authenticate(['user']), chatController.createChat);

router.get('/get-all-chats', authenticate(['user']), chatController.getAllChats);

router.post('/new-message', authenticate(['user']), messageController.createNewMessage);

export default router;
