import { ITargetAudienceController } from '@/core/interfaces/controllers/ITargetAudienceController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import { Router } from 'express';

const router = Router();
const controller = container.get<ITargetAudienceController>(TYPES.TargetAudienceController);

router.post('/', authenticate(['admin', 'user', 'premium', 'mentor']), controller.create);
router.get('/', authenticate(['admin', 'user', 'premium', 'mentor']), controller.getAll);
router.get('/:id', authenticate(['admin', 'user', 'premium', 'mentor']), controller.getById);
router.put('/:id', authenticate(['admin']), controller.update);
router.delete('/:id', authenticate(['admin']), controller.softDelete);
router.patch('/:id/restore', authenticate(['admin']), controller.restore);

export default router;
