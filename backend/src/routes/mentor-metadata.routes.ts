import { Router } from 'express';

import type { IMentorMetadataController } from '@/core/interfaces/controllers/i-mentor-metadata-controller';

import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();
const controller = container.get<IMentorMetadataController>(TYPES.MentorMetadataController);

router.post('/', authenticate(['admin', 'user', 'premium', 'mentor']), controller.create);
router.get('/', authenticate(['admin', 'user', 'premium', 'mentor']), controller.findAll);
router.get(
  '/type/:type',
  authenticate(['admin', 'user', 'premium', 'mentor']),
  controller.findByType
);
router.get('/:id', authenticate(['admin', 'user', 'premium', 'mentor']), controller.findById);
router.put('/:id', authenticate(['admin']), controller.update);
router.delete('/:id', authenticate(['admin']), controller.softDelete);
router.patch('/:id/restore', authenticate(['admin']), controller.restore);

export default router;
