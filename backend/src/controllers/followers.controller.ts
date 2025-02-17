import { Request, Response } from "express";
import { IFollowersController } from "../core/interfaces/controllers/IFollowersController";
import { FollowersService } from "../services/followers.service";
import { CustomRequest } from "../core/types/CustomRequest";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";

@injectable()
export class FollowersController implements IFollowersController {
  constructor(
    @inject(TYPES.FollowersService) private followersService: FollowersService
  ) {}

  followUser = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { followedId } = req.body;
      const followerId = req.user?._id as string;

      const result = await this.followersService.followUser(followerId, followedId);
      if (!result) res.status(400).json({ message: "Already following this user" });

      res.status(201).json({ message: "Followed successfully", data: result });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };

  unfollowUser = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { followedId } = req.body;
      const followerId = req.user?._id as string;

      const result = await this.followersService.unfollowUser(followerId, followedId);
      if (!result) res.status(400).json({ message: "Not following this user" });

      res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };

  getFollowers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const followers = await this.followersService.getFollowers(userId);

      res
        .status(200)
        .json({ message: "Followers fetched successfully", data: followers });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };

  getFollowing = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const following = await this.followersService.getFollowing(userId);

      res
        .status(200)
        .json({ message: "Following list fetched successfully", data: following });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };

  isFollowing = async (req: Request, res: Response): Promise<void> => {
    try {
      const { followerId, followedId } = req.query;
      if (!followerId || !followedId)
        res.status(400).json({ message: "Missing required query parameters" });

      const result = await this.followersService.isFollowing(
        followerId as string,
        followedId as string
      );

      res.status(200).json({ isFollowing: result });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };
}
