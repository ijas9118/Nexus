import { IAdminDashboardController } from '@/core/interfaces/controllers/IAdminDashboardController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { Router } from 'express';

const adminController = container.get<IAdminDashboardController>(TYPES.AdminDashboardController);

const router = Router();

router.get('/stats', adminController.getDashboardStats);

export default router;
