import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { TYPES } from '@/di/types';
import { container } from '@/di/container';

const router = Router();
const notificationController = container.get<NotificationController>(TYPES.NotificationController);

// Protected routes (require authentication)
// router.post('/', authenticate(['admin']), notificationController.createNotification);
router.get(
  '/:userId',
  authenticate(['admin', 'mentor', 'premium', 'user']),
  notificationController.getUserNotifications
);
router.patch(
  '/:id/read',
  authenticate(['admin', 'mentor', 'premium', 'user']),
  notificationController.markAsRead
);
router.patch(
  '/:userId/read-all',
  authenticate(['admin', 'mentor', 'premium', 'user']),
  notificationController.markAllAsRead
);
router.delete(
  '/:id',
  authenticate(['admin', 'mentor', 'premium', 'user']),
  notificationController.deleteNotification
);
router.delete(
  '/',
  authenticate(['admin', 'mentor', 'premium', 'user']),
  notificationController.deleteManyNotifications
);

export default router;
