import { Router } from 'express';
import postsRoutes from './content/posts.routes';
import historyRoutes from './content/history.routes';
import commentRoutes from './content/comment.routes';

const router = Router();

router.use('/posts', postsRoutes);
router.use('/history', historyRoutes);
router.use('/comment', commentRoutes);

export default router;
