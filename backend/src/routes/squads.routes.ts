import { Router } from 'express';
import { validateRequest } from '@/middlewares/validate.middleware';
import { container } from '@/di/container';
import { ISquadController } from '@/core/interfaces/controllers/ISquadController';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import { joinSquadSchema } from '@/validations/squad.schema';

const router = Router();

const squadController = container.get<ISquadController>(TYPES.SquadController);

router.get('/', authenticate(['user']), squadController.getSquadsByCategory);
router.post('/', authenticate(['user']), squadController.createSquad);
router.post(
  '/:squadId/join',
  authenticate(['user']),
  validateRequest(joinSquadSchema),
  squadController.joinSquad
);

export default router;
