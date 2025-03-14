import { IContentController } from '@/core/interfaces/controllers/IContentController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { Router } from 'express';

const contentController = container.get<IContentController>(TYPES.ContentController);

const router = Router();

router.get('/', contentController.getPosts);

export default router;
