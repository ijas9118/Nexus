import { IAdminAuthController } from '@/core/interfaces/controllers/admin/IAdminAuthController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { Router } from 'express';

const adminAuthController = container.get<IAdminAuthController>(TYPES.AdminAuthController);

const router = Router();

router.post('/login', adminAuthController.login);

router.get('/logout', adminAuthController.logout);

export default router;
