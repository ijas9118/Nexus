import { Request, Response } from "express";
import { IFollowersController } from "../core/interfaces/controllers/IFollowersController";
import { CustomRequest } from "../core/types/CustomRequest";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IFollowersService } from "../core/interfaces/services/IFollowersService";
import asyncHandler from "express-async-handler";

@injectable()
export class FollowersController implements IFollowersController {
  constructor(
    @inject(TYPES.FollowersService) private followersService: IFollowersService
  ) {}

  followUser = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { followedId } = req.body;
      const followerId = req.user?._id as string;

      if (!followedId) {
        res.status(400).json({ message: "Followed user ID is required" });
        return;
      }

      const result = await this.followersService.followUser(followerId, followedId);
      if (!result) {
        res.status(400).json({ message: "Already following this user" });
        return;
      }

      res.status(201).json({ message: "Followed successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });

  unfollowUser = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
      try {
        const { followedId } = req.body;
        const followerId = req.user?._id as string;

        if (!followedId) {
          res.status(400).json({ message: "Followed user ID is required" });
          return;
        }

        const result = await this.followersService.unfollowUser(followerId, followedId);
        if (!result) {
          res.status(400).json({ message: "Not following this user" });
          return;
        }

        res.status(200).json({ message: "Unfollowed successfully" });
      } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    }
  );

  getFollowers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      const followers = await this.followersService.getFollowers(userId);
      res
        .status(200)
        .json({ message: "Followers fetched successfully", data: followers });
    } catch (error: any) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });

  getFollowing = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      const following = await this.followersService.getFollowing(userId);
      res
        .status(200)
        .json({ message: "Following list fetched successfully", data: following });
    } catch (error: any) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });

  isFollowing = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const { followerId, followedId } = req.body;

      if (!followerId || !followedId) {
        res.status(400).json({ message: "Missing required query parameters" });
        return;
      }

      const result = await this.followersService.isFollowing(
        followerId as string,
        followedId as string
      );

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });

  getAllConnections = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
      try {
        const userId = req.user?._id as string;

        const result = await this.followersService.getAllConnections(userId);
        res.status(200).json(result);
      } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    }
  );

  getPendingRequests = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
      try {
        const userId = req.user?._id as string;

        const result = await this.followersService.getPendingRequest(userId);
        res.status(200).json(result);
      } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    }
  );

  sendConnectionRequest = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
      try {
        const requesterId = req.user?._id as string;
        const { recipientId } = req.body;
        const result = await this.followersService.sendConnectionRequest(
          requesterId,
          recipientId
        );
        res.status(result ? 200 : 400).json({ success: result });
      } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    }
  );

  acceptConnectionRequest = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
      try {
        const userId = req.user?._id as string;
        const { requesterId } = req.body;
        const result = await this.followersService.acceptConnectionRequest(
          userId,
          requesterId
        );
        res.status(result ? 200 : 400).json({ success: result });
      } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    }
  );

  hasSentConnectionRequest = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
      try {
        const requesterId = req.user?._id as string;
        const { recipientId } = req.body;
        const result = await this.followersService.hasSentConnectionRequest(
          requesterId,
          recipientId
        );
        res.status(result ? 200 : 400).json({ result });
      } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    }
  );

  withdrawConnectionRequest = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
      try {
        const requesterId = req.user?._id as string;
        const { recipientId } = req.body;
        const result = await this.followersService.withdrawConnectionRequest(
          requesterId,
          recipientId
        );
        res.status(result ? 200 : 400).json({ result });
      } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    }
  );
}
