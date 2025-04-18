import { IMentorController } from '@/core/interfaces/controllers/IMentorController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import { Router } from 'express';

const mentorController = container.get<IMentorController>(TYPES.MentorController);

const router = Router();

router.post('/apply', authenticate(['admin', 'user']), mentorController.applyAsMentor);

router.get(
  '/get-status',
  authenticate(['admin', 'mentor', 'premium', 'user']),
  mentorController.getStatus
);

router.get('/all', mentorController.getAllMentors);

router.patch('/approve/:mentorId/:userId', authenticate(['admin']), mentorController.approveMentor);

router.patch('/reject/:mentorId', authenticate(['admin']), mentorController.rejectMentor);

export default router;
