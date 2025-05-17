import { IConnectionsController } from '@/core/interfaces/controllers/IConnectionsController';
import { IFollowersController } from '@/core/interfaces/controllers/IFollowersController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import { Router } from 'express';

const followersController = container.get<IFollowersController>(TYPES.FollowersController);
const connectionsController = container.get<IConnectionsController>(TYPES.ConnectionsController);

const router = Router();

router.post('/follow', authenticate(['user', 'premium', 'mentor']), followersController.followUser);

router.post(
  '/unfollow',
  authenticate(['user', 'premium', 'mentor']),
  followersController.unfollowUser
);

router.get(
  '/:userId/followers',
  authenticate(['user', 'premium', 'mentor']),
  followersController.getFollowers
);

router.get(
  '/:userId/following',
  authenticate(['user', 'premium', 'mentor']),
  followersController.getFollowing
);

router.get(
  '/:userId/connections',
  authenticate(['user', 'premium', 'mentor']),
  followersController.getConnections
);

router.post('/is-following', followersController.isFollowing);

router.post(
  '/connect',
  authenticate(['user', 'premium', 'mentor']),
  connectionsController.sendConnectionRequest
);

router.post(
  '/accept',
  authenticate(['user', 'premium', 'mentor']),
  connectionsController.acceptConnectionRequest
);

router.post(
  '/has-requested',
  authenticate(['user', 'premium', 'mentor']),
  connectionsController.hasSentConnectionRequest
);

router.post(
  '/is-connected',
  authenticate(['user', 'premium', 'mentor']),
  connectionsController.isConnected
);

router.post(
  '/withdraw',
  authenticate(['user', 'premium', 'mentor']),
  connectionsController.withdrawConnectionRequest
);

router.get(
  '/connections',
  authenticate(['user', 'premium', 'mentor']),
  connectionsController.searchConnections
);

router.get(
  '/get-all-connections',
  authenticate(['user', 'mentor', 'premium']),
  connectionsController.getAllConnections
);

router.get(
  '/pending',
  authenticate(['user', 'premium', 'mentor']),
  connectionsController.getPendingRequests
);

router.get(
  '/stats/:userId',
  authenticate(['user', 'premium', 'mentor', 'admin']),
  followersController.getFollowStats
);

router.get(
  '/sent-requests',
  authenticate(['user', 'premium', 'mentor']),
  connectionsController.getSentConnectionRequests
);

export default router;
