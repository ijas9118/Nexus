import { Router } from 'express';

import type { ICommentController } from '@/core/interfaces/controllers/i-comment-controller';

import { container } from '@/di/container';
import { TYPES } from '@/di/types';

const commentController = container.get<ICommentController>(TYPES.CommentController);

const router = Router();

router.get('/', commentController.getAllComments);

export default router;
