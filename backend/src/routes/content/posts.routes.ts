import { IBookmarkController } from '@/core/interfaces/controllers/IBookmarkController';
import { IContentController } from '@/core/interfaces/controllers/IContentController';
import { ILikesController } from '@/core/interfaces/controllers/ILikesController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validate.middleware';
import { toggleSchema, verifyContentSchema } from '@/validations/content.schema';
import { Router } from 'express';

const router = Router();
const contentController = container.get<IContentController>(TYPES.ContentController);
const likesController = container.get<ILikesController>(TYPES.LikesController);
const bookmarkController = container.get<IBookmarkController>(TYPES.BookmarkController);

router.get('/', authenticate(['user', 'admin', 'premium']), contentController.getAllContent);

router.post('/', authenticate(['user', 'premium']), contentController.createContent);

router.post(
  '/:id/bookmark',
  authenticate(['user', 'premium']),
  validateRequest(toggleSchema),
  bookmarkController.toggleBookmark
);

router.get('/bookmarks', authenticate(['user', 'premium']), bookmarkController.getAllBookmarks);

router.post(
  '/verify/:contentId',
  authenticate(['premium', 'mentor', 'admin']),
  validateRequest(verifyContentSchema),
  contentController.verifyContent
);

router.get(
  '/following',
  authenticate(['user', 'premium']),
  contentController.getFollowingUsersContents
);

router.get('/:id', authenticate(['user', 'admin', 'premium']), contentController.getContent);

router.post(
  '/:id/like',
  authenticate(['user', 'premium']),
  validateRequest(toggleSchema),
  likesController.toggleLike
);

export default router;
