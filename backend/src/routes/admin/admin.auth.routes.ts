import { Router } from 'express';

import type { IAdminAuthController } from '@/core/interfaces/controllers/admin/i-admin-auth-controller';

import { container } from '@/di/container';
import { TYPES } from '@/di/types';

const adminAuthController = container.get<IAdminAuthController>(TYPES.AdminAuthController);

const router = Router();

router.post('/login', adminAuthController.login);

router.get('/logout', adminAuthController.logout);

export default router;
