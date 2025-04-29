import { Router } from 'express';
import { container } from '../di/container';
import { TYPES } from '../di/types';
import { ISubscriptionController } from '@/core/interfaces/controllers/ISubscriptionController';
import { authenticate } from '@/middlewares/auth.middleware';

const subscriptionController = container.get<ISubscriptionController>(TYPES.SubscriptionController);

const router = Router();

router.get(
  '/current',
  authenticate(['admin', 'premium', 'user']),
  subscriptionController.getCurrentSubscription
);

export default router;
