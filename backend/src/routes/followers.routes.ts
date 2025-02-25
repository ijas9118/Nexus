import { Router } from "express";
import { container } from "../di/container";
import { FollowersController } from "../controllers/followers.controller";
import { TYPES } from "../di/types";
import { authenticate } from "../middlewares/auth.middleware";

const followersController = container.get<FollowersController>(TYPES.FollowersController);

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
  followersController.sendConnectionRequest
);
router.post(
  "/accept",
  authenticate(["user"]),
  followersController.acceptConnectionRequest
);
router.post(
  "/has-requested",
  authenticate(["user"]),
  followersController.hasSentConnectionRequest
);
router.post(
  "/withdraw",
  authenticate(["user"]),
  followersController.withdrawConnectionRequest
);

router.get("/connections", authenticate(["user"]), followersController.getAllConnections);

router.get("/pending", authenticate(["user"]), followersController.getPendingRequests);

export default router;
