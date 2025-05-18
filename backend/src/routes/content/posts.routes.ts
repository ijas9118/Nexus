import { IBookmarkController } from '@/core/interfaces/controllers/IBookmarkController';
import { IContentController } from '@/core/interfaces/controllers/IContentController';
import { IVoteController } from '@/core/interfaces/controllers/IVoteController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import upload from '@/middlewares/multer';
import { Router } from 'express';

const router = Router();
const contentController = container.get<IContentController>(TYPES.ContentController);
const voteController = container.get<IVoteController>(TYPES.VoteController);
const bookmarkController = container.get<IBookmarkController>(TYPES.BookmarkController);

router.get(
  '/',
  authenticate(['user', 'admin', 'premium', 'mentor']),
  contentController.getAllContent
);

router.post(
  '/',
  authenticate(['user', 'premium', 'mentor']),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'videoFile', maxCount: 1 },
  ]),
  contentController.createContent
);

router.post(
  '/:id/bookmark',
  authenticate(['user', 'premium', 'mentor']),
  bookmarkController.toggleBookmark
);

router.get(
  '/bookmarks',
  authenticate(['user', 'premium', 'mentor']),
  bookmarkController.getAllBookmarks
);

router.post(
  '/verify/:contentId',
  authenticate(['premium', 'mentor', 'admin']),
  contentController.verifyContent
);

router.get(
  '/following',
  authenticate(['user', 'premium', 'mentor']),
  contentController.getFollowingUsersContents
);

router.get(
  '/:id',
  authenticate(['user', 'admin', 'premium', 'mentor']),
  contentController.getContent
);

// Route to vote on content (upvote/downvote)
router.post(
  '/vote',
  authenticate(['user', 'admin', 'premium', 'mentor']),
  voteController.voteContent
);

// Route to get all votes by user
router.get(
  '/user-votes',
  authenticate(['user', 'admin', 'premium', 'mentor']),
  voteController.getUserVotes
);

export default router;
