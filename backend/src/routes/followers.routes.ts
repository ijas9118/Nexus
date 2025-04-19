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
  authenticate(['user', 'premium', 'mentor']),
  validateRequest(followUserSchema),
  followersController.followUser
);

router.post(
  '/unfollow',
  authenticate(['user', 'premium', 'mentor']),
  validateRequest(followUserSchema),
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

router.post('/is-following', validateRequest(isFollowingSchema), followersController.isFollowing);

router.post(
  '/connect',
  authenticate(['user', 'premium', 'mentor']),
  validateRequest(sendConnectionSchema),
  connectionsController.sendConnectionRequest
);

router.post(
  '/accept',
  authenticate(['user', 'premium', 'mentor']),
  validateRequest(acceptConnectionSchema),
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
  validateRequest(isConnectedSchema),
  connectionsController.isConnected
);

router.post(
  '/withdraw',
  authenticate(['user', 'premium', 'mentor']),
  validateRequest(withdrawConnectionSchema),
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

export default router;
