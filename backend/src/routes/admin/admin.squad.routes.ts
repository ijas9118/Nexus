import { Router } from 'express';

import type { ISquadController } from '@/core/interfaces/controllers/i-squad-controller';

import { container } from '@/di/container';
import { TYPES } from '@/di/types';

const squadController = container.get<ISquadController>(TYPES.SquadController);

const router = Router();

router.post('/', squadController.createSquad);
router.get('/', squadController.getAllSquads);
router.post('/:id/toggle', squadController.toggleSquad);

export default router;
