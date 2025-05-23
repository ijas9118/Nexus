import { Router } from 'express';
import adminAuthRoutes from './admin/admin.auth.routes';
import adminUserRoutes from './admin/admin.users.routes';
import adminCategoryRoutes from './admin/admin.category.routes';
import adminSquadRoutes from './admin/admin.squad.routes';
import adminCommentRoutes from './admin/admin.comment.routes';
import adminContentRoutes from './admin/admin.content.routes';
import adminDashboardRoutes from './admin/admin.dashboard.routes';

import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

router.use('/', adminAuthRoutes);
router.use('/user', authenticate(['admin']), adminUserRoutes);
router.use('/category', authenticate(['admin', 'user', 'premium', 'mentor']), adminCategoryRoutes);
router.use('/squad', authenticate(['admin']), adminSquadRoutes);
router.use('/comment', authenticate(['admin']), adminCommentRoutes);
router.use('/content', authenticate(['admin']), adminContentRoutes);
router.use('/dashboard', authenticate(['admin']), adminDashboardRoutes);

export default router;
