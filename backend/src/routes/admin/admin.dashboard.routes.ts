import { IAdminDashboardController } from '@/core/interfaces/controllers/IAdminDashboardController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { Router } from 'express';

const adminDashboardController = container.get<IAdminDashboardController>(
  TYPES.AdminDashboardController
);

const router = Router();

router.get('/stats', adminDashboardController.getDashboardStats);

router.get('/subscription-stats', adminDashboardController.getSubscriptionStats);

router.get('/revenue-stats', adminDashboardController.getRevenueStats);

router.get('/mentor-application-stats', adminDashboardController.getMentorApplicationStats);

export default router;
