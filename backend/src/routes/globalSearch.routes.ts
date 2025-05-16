import { IGlobalSearchController } from '@/core/interfaces/controllers/IGlobalSearchController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import { Router } from 'express';

const globalSearchController = container.get<IGlobalSearchController>(TYPES.GlobalSearchController);

const router = Router();

router.get(
  '/',
  authenticate(['admin', 'mentor', 'premium', 'user']),
  globalSearchController.search
);

export default router;
