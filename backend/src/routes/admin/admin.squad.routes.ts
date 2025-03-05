import { Router } from 'express';
import { container } from '../../di/container';
import { SquadController } from '../../controllers/squad.controller';
import { TYPES } from '../../di/types';

const squadController = container.get<SquadController>(TYPES.SquadController);

const router = Router();

router.post('/', squadController.createSquad);
router.get('/', squadController.getAllSquads);
router.post('/:id/toggle', squadController.toggleSquad);

export default router;
