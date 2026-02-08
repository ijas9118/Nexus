import { Router } from 'express';

import commentRoutes from './content/comment.routes';
import historyRoutes from './content/history.routes';
import postsRoutes from './content/posts.routes';

const router = Router();

router.use('/posts', postsRoutes);
router.use('/history', historyRoutes);
router.use('/comment', commentRoutes);

export default router;
