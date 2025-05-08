import { Router } from 'express';
import { authenticate } from '@/middlewares/auth.middleware';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { INotificationTypeController } from '@/core/interfaces/controllers/INotificationTypeController';

const router = Router();
const notificationTypeController = container.get<INotificationTypeController>(
  TYPES.NotificationTypeController
);

router.post('/', authenticate(['admin']), notificationTypeController.createNotificationType);

router.get('/', authenticate(['admin']), notificationTypeController.getNotificationTypes);

router.put('/:id', authenticate(['admin']), notificationTypeController.updateNotificationType);

router.delete('/:id', authenticate(['admin']), notificationTypeController.deleteNotificationType);

router.patch(
  '/:id/restore',
  authenticate(['admin']),
  notificationTypeController.restoreNotificationType
);

export default router;
