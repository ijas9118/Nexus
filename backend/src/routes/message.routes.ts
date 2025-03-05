import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { container } from '../di/container';
import { TYPES } from '../di/types';
import { MessageController } from '../controllers/message.controller';

const messageController = container.get<MessageController>(TYPES.MessageController);

const router = Router();

router.post('/new-message', authenticate(['user']), messageController.createNewMessage);

router.get('/get-all-messages/:chatId', authenticate(['user']), messageController.getAllMessages);

export default router;
