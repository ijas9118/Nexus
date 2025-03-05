import { Router } from 'express';
import { container } from '../di/container';
import { MentorController } from '../controllers/mentor.controller';
import { TYPES } from '../di/types';

const mentorController = container.get<MentorController>(TYPES.MentorController);

const router = Router();

router.get('/', mentorController.getAllMentors);
router.post('/register', mentorController.completeProfile);

export default router;
