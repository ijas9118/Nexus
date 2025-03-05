import { Router } from 'express';
import { container } from '../di/container';
import { SquadController } from '../controllers/squad.controller';
import { TYPES } from '../di/types';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

const squadController = container.get<SquadController>(TYPES.SquadController);

router.get('/', authenticate(['user']), squadController.getSquadsByCategory);
router.post('/', authenticate(['user']), squadController.createSquad);
router.post('/:squadId/join', authenticate(['user']), squadController.joinSquad);

export default router;
