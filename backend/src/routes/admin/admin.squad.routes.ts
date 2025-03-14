import { ISquadController } from '@/core/interfaces/controllers/ISquadController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { Router } from 'express';

const squadController = container.get<ISquadController>(TYPES.SquadController);

const router = Router();

router.post('/', squadController.createSquad);
router.get('/', squadController.getAllSquads);
router.post('/:id/toggle', squadController.toggleSquad);

export default router;
