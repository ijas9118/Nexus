import { IConnectionsController } from '@/core/interfaces/controllers/IConnectionsController';
import { IFollowersController } from '@/core/interfaces/controllers/IFollowersController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validate.middleware';
import {
  acceptConnectionSchema,
  followUserSchema,
  isConnectedSchema,
  isFollowingSchema,
  sendConnectionSchema,
  withdrawConnectionSchema,
} from '@/validations/followers.schema';
import { Router } from 'express';

const followersController = container.get<IFollowersController>(TYPES.FollowersController);
const connectionsController = container.get<IConnectionsController>(TYPES.ConnectionsController);

const router = Router();

router.post(
  '/follow',
  authenticate(['user', 'premium']),
  validateRequest(followUserSchema),
  followersController.followUser
);

router.post(
  '/unfollow',
  authenticate(['user', 'premium']),
  validateRequest(followUserSchema),
  followersController.unfollowUser
);

router.get(
  '/:userId/followers',
  authenticate(['user', 'premium']),
  followersController.getFollowers
);

router.get(
  '/:userId/following',
  authenticate(['user', 'premium']),
  followersController.getFollowing
);

router.post('/is-following', validateRequest(isFollowingSchema), followersController.isFollowing);

router.post(
  '/connect',
  authenticate(['user', 'premium']),
  validateRequest(sendConnectionSchema),
  connectionsController.sendConnectionRequest
);

router.post(
  '/accept',
  authenticate(['user', 'premium']),
  validateRequest(acceptConnectionSchema),
  connectionsController.acceptConnectionRequest
);

router.post(
  '/has-requested',
  authenticate(['user', 'premium']),
  connectionsController.hasSentConnectionRequest
);

router.post(
  '/is-connected',
  authenticate(['user', 'premium']),
  validateRequest(isConnectedSchema),
  connectionsController.isConnected
);

router.post(
  '/withdraw',
  authenticate(['user', 'premium']),
  validateRequest(withdrawConnectionSchema),
  connectionsController.withdrawConnectionRequest
);

router.get(
  '/connections',
  authenticate(['user', 'premium']),
  connectionsController.searchConnections
);

router.get('/pending', authenticate(['user', 'premium']), connectionsController.getPendingRequests);

export default router;
