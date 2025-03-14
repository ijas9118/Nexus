import { Router } from 'express';
import { IMentorController } from '@/core/interfaces/controllers/IMentorController';
import { TYPES } from '@/di/types';
import { container } from '@/di/container';
import { validateRequest } from '@/middlewares/validate.middleware';
import { acceptInvitationSchema, sendInvitationSchema } from '@/validations/mentor.schema';

const mentorController = container.get<IMentorController>(TYPES.MentorController);

const router = Router();

router.post('/invite', validateRequest(sendInvitationSchema), mentorController.sendInvitation);

router.post(
  '/acceptInvite',
  validateRequest(acceptInvitationSchema),
  mentorController.acceptInvitation
);

export default router;
