import { Router } from 'express';
import { validateRequest } from '@/middlewares/validate.middleware';
import { addCommentSchema } from '@/validations/content.schema';
import { container } from '@/di/container';
import { ICommentController } from '@/core/interfaces/controllers/ICommentController';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';

const commentController = container.get<ICommentController>(TYPES.CommentController);

const router = Router();

router.post(
  '/',
  authenticate(['user', 'mentor', 'premium', 'admin']),
  validateRequest(addCommentSchema),
  commentController.addComment
);

router.get('/', authenticate(['user', 'premium']), commentController.getCommentsByContentId);

export default router;
