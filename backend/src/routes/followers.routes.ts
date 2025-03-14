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
  authenticate(['user']),
  validateRequest(followUserSchema),
  followersController.followUser
);

router.post(
  '/unfollow',
  authenticate(['user']),
  validateRequest(followUserSchema),
  followersController.unfollowUser
);

router.get('/:userId/followers', authenticate(['user']), followersController.getFollowers);

router.get('/:userId/following', authenticate(['user']), followersController.getFollowing);

router.post('/is-following', validateRequest(isFollowingSchema), followersController.isFollowing);

router.post(
  '/connect',
  authenticate(['user']),
  validateRequest(sendConnectionSchema),
  connectionsController.sendConnectionRequest
);

router.post(
  '/accept',
  authenticate(['user']),
  validateRequest(acceptConnectionSchema),
  connectionsController.acceptConnectionRequest
);

router.post(
  '/has-requested',
  authenticate(['user']),
  connectionsController.hasSentConnectionRequest
);

router.post(
  '/is-connected',
  authenticate(['user']),
  validateRequest(isConnectedSchema),
  connectionsController.isConnected
);

router.post(
  '/withdraw',
  authenticate(['user']),
  validateRequest(withdrawConnectionSchema),
  connectionsController.withdrawConnectionRequest
);

router.get('/connections', authenticate(['user']), connectionsController.getAllConnections);

router.get('/pending', authenticate(['user']), connectionsController.getPendingRequests);

export default router;
