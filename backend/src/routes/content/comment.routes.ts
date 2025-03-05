import { Request, Router } from 'express';
import { container } from '../../di/container';
import { ICommentController } from '../../core/interfaces/controllers/ICommentController';
import { TYPES } from '../../di/types';
import { authenticate } from '../../middlewares/auth.middleware';

const commentController = container.get<ICommentController>(TYPES.CommentController);

const router = Router();

router.post(
  '/',
  authenticate(['user', 'mentor', 'premium', 'admin']),
  commentController.addComment
);

router.get('/', authenticate(['user']), commentController.getCommentsByContentId);

export default router;
