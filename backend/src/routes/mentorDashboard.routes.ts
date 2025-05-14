import { IMentorDashboardController } from '@/core/interfaces/controllers/IMentorDashboardController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { Router } from 'express';

const mentorController = container.get<IMentorDashboardController>(TYPES.MentorDashboardController);

const router = Router();

router.get('/earnings', mentorController.getEarnings);
router.get('/pending-withdrawals', mentorController.getPendingWithdrawalWithBalance);
router.get('/session-stats', mentorController.getSessionStats);
router.get('/recent-bookings', mentorController.getRecentBookings);

export default router;
