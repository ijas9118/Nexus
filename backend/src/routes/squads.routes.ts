import { Router } from 'express';
import { container } from '@/di/container';
import { ISquadController } from '@/core/interfaces/controllers/ISquadController';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

const squadController = container.get<ISquadController>(TYPES.SquadController);

router.get('/', authenticate(['user', 'premium', 'mentor']), squadController.getSquadsByCategory);
router.post('/', authenticate(['user', 'premium', 'mentor']), squadController.createSquad);
router.post(
  '/:squadId/join',
  authenticate(['user', 'premium', 'mentor']),
  squadController.joinSquad
);

export default router;
