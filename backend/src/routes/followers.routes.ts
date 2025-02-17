import { Router } from "express";
import { container } from "../di/container";
import { FollowersController } from "../controllers/followers.controller";
import { TYPES } from "../di/types";

const followersController = container.get<FollowersController>(TYPES.FollowersController);

const router = Router();

router.post("/follow", followersController.followUser);
router.post("/unfollow", followersController.unfollowUser);
router.get("/:userId/followers", followersController.getFollowers);
router.get("/:userId/following", followersController.getFollowing);
router.get("/is-following", followersController.isFollowing);

export default router;
