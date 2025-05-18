import { Router } from 'express';
import { container } from '@/di/container';
import { ISquadController } from '@/core/interfaces/controllers/ISquadController';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import upload from '@/middlewares/multer';

const router = Router();

const squadController = container.get<ISquadController>(TYPES.SquadController);

router.get('/', authenticate(['user', 'premium', 'mentor']), squadController.getSquadsByCategory);
router.post(
  '/',
  authenticate(['user', 'premium', 'mentor']),
  upload.single('logo'),
  squadController.createSquad
);
router.post(
  '/:squadId/join',
  authenticate(['user', 'premium', 'mentor']),
  squadController.joinSquad
);

export default router;
