import { IMentorController } from '@/core/interfaces/controllers/IMentorController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { validateRequest } from '@/middlewares/validate.middleware';
import { completeProfileSchema } from '@/validations/mentor.schema';
import { Router } from 'express';

const mentorController = container.get<IMentorController>(TYPES.MentorController);

const router = Router();

router.get('/', mentorController.getAllMentors);
router.post('/register', validateRequest(completeProfileSchema), mentorController.completeProfile);

export default router;
