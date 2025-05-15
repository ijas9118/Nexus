import { IMentorshipTypeController } from '@/core/interfaces/controllers/IMentorshipTypeController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import {
  CreateMentorshipTypeRequestDto,
  UpdateMentorshipTypeRequestDto,
} from '@/dtos/requests/mentorship-type.dto';
import { authenticate } from '@/middlewares/auth.middleware';
import { validateDto } from '@/middlewares/validate-dto.middleware';
import { Router } from 'express';

const mentorshipTypeController = container.get<IMentorshipTypeController>(
  TYPES.MentorshipTypeController
);

const router = Router();

// Get all mentorship types
router.get(
  '/',
  authenticate(['admin', 'user', 'premium', 'mentor']),
  mentorshipTypeController.getAll
);

// Get a single mentorship type by ID
router.get(
  '/:id',
  authenticate(['admin', 'user', 'premium', 'mentor']),
  mentorshipTypeController.getById
);

// Create a new mentorship type
router.post(
  '/',
  authenticate(['admin']),
  validateDto(CreateMentorshipTypeRequestDto),
  mentorshipTypeController.create
);

// Update a mentorship type by ID
router.put(
  '/:id',
  authenticate(['admin']),
  validateDto(UpdateMentorshipTypeRequestDto),
  mentorshipTypeController.update
);

// Delete (soft delete) a mentorship type by ID
router.delete('/:id', authenticate(['admin']), mentorshipTypeController.delete);

// Restore a soft-deleted mentorship type by ID
router.patch('/:id/restore', authenticate(['admin']), mentorshipTypeController.restore);

export default router;
