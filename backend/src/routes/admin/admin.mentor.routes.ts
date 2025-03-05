import { Router } from 'express';
import { container } from '../../di/container';
import { MentorController } from '../../controllers/mentor.controller';
import { TYPES } from '../../di/types';

const mentorController = container.get<MentorController>(TYPES.MentorController);

const router = Router();

router.post('/invite', mentorController.sendInvitation);
router.post('/acceptInvite', mentorController.acceptInvitation);

export default router;
