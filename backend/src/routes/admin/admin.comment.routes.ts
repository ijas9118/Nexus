import { Router } from 'express';
import { ICommentController } from '@/core/interfaces/controllers/ICommentController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';

const commentController = container.get<ICommentController>(TYPES.CommentController);

const router = Router();

router.get('/', commentController.getAllComments);

export default router;
