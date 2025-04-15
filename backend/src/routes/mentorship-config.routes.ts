import { IMentorshipConfigController } from '@/core/interfaces/controllers/IMentorshipConfigController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import { Router } from 'express';

const configController = container.get<IMentorshipConfigController>(
  TYPES.MentorshipConfigController
);

const router = Router();

router.post('/', authenticate(['admin']), configController.createConfig);
router.get(
  '/',
  authenticate(['admin', 'mentor', 'premium', 'user']),
  configController.getAllConfigs
);
router.get(
  '/:category',
  authenticate(['admin', 'mentor', 'premium', 'user']),
  configController.getConfigsByCategory
);
router.get(
  '/id/:id',
  authenticate(['admin', 'mentor', 'premium', 'user']),
  configController.getConfigById
);
router.put('/:id', authenticate(['admin']), configController.updateConfig);
router.delete('/:id', authenticate(['admin']), configController.deleteConfig);

export default router;
