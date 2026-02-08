import { Router } from 'express';

import type { IAdminDashboardController } from '@/core/interfaces/controllers/i-admin-dashboard-controller';

import { container } from '@/di/container';
import { TYPES } from '@/di/types';

const adminDashboardController = container.get<IAdminDashboardController>(
  TYPES.AdminDashboardController
);

const router = Router();

router.get('/stats', adminDashboardController.getDashboardStats);

router.get('/subscription-stats', adminDashboardController.getSubscriptionStats);

router.get('/revenue-stats', adminDashboardController.getRevenueStats);

router.get('/mentor-application-stats', adminDashboardController.getMentorApplicationStats);

export default router;
