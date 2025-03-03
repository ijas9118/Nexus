import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { authenticate } from "../middlewares/auth.middleware";
import { IFollowersController } from "../core/interfaces/controllers/IFollowersController";
import { IConnectionsController } from "../core/interfaces/controllers/IConnectionsController";

const followersController = container.get<IFollowersController>(
  TYPES.FollowersController
);
const connectionsController = container.get<IConnectionsController>(
  TYPES.ConnectionsController
);

const router = Router();

router.post("/follow", authenticate(["user"]), followersController.followUser);

router.post("/unfollow", authenticate(["user"]), followersController.unfollowUser);

router.get(
  "/:userId/followers",
  authenticate(["user"]),
  followersController.getFollowers
);

router.get(
  "/:userId/following",
  authenticate(["user"]),
  followersController.getFollowing
);

router.post("/is-following", followersController.isFollowing);

router.post(
  "/connect",
  authenticate(["user"]),
  connectionsController.sendConnectionRequest
);

router.post(
  "/accept",
  authenticate(["user"]),
  connectionsController.acceptConnectionRequest
);

router.post(
  "/has-requested",
  authenticate(["user"]),
  connectionsController.hasSentConnectionRequest
);

router.post("/is-connected", authenticate(["user"]), connectionsController.isConnected);

router.post(
  "/withdraw",
  authenticate(["user"]),
  connectionsController.withdrawConnectionRequest
);

router.get(
  "/connections",
  authenticate(["user"]),
  connectionsController.getAllConnections
);

router.get("/pending", authenticate(["user"]), connectionsController.getPendingRequests);

export default router;
