import { Router } from 'express';

import type { IGlobalSearchController } from '@/core/interfaces/controllers/i-global-search-controller';

import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';

const globalSearchController = container.get<IGlobalSearchController>(TYPES.GlobalSearchController);

const router = Router();

router.get(
  '/',
  authenticate(['admin', 'mentor', 'premium', 'user']),
  globalSearchController.search
);

export default router;
