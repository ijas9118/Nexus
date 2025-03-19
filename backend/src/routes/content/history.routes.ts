import { Router } from 'express';
import { validateRequest } from '@/middlewares/validate.middleware';
import { removeFromHistorySchema } from '@/validations/content.schema';
import { IHistoryController } from '@/core/interfaces/controllers/IHistoryController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';

const historyController = container.get<IHistoryController>(TYPES.HistoryController);

const router = Router();

router.get('/', authenticate(['user', 'premium']), historyController.getAllHistory);

router.post(
  '/remove/',
  authenticate(['user', 'premium']),
  validateRequest(removeFromHistorySchema),
  historyController.removeFromHistory
);

export default router;
