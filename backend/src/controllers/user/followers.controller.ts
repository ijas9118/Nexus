import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IFollowersController } from "@/core/interfaces/controllers/i-followers-controller";
import type { IFollowersService } from "@/core/interfaces/services/i-followers-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { USER_MESSAGES } = MESSAGES;

@injectable()
export class FollowersController implements IFollowersController {
  constructor(@inject(TYPES.FollowersService) private _followersService: IFollowersService) {}

  followUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { followedId } = req.body;
    const followerId = req.user?._id as string;

    if (!followedId) {
      throw new CustomError(USER_MESSAGES.FOLLOWED_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const result = await this._followersService.followUser(followerId, followedId);

    if (!result) {
      throw new CustomError(USER_MESSAGES.ALREADY_FOLLOWING, StatusCodes.BAD_REQUEST);
    }

    res.status(StatusCodes.CREATED).json({ message: USER_MESSAGES.FOLLOW_SUCCESS });
  });

  unfollowUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { followedId } = req.body;
    const followerId = req.user?._id as string;

    if (!followedId) {
      throw new CustomError(USER_MESSAGES.FOLLOWED_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const result = await this._followersService.unfollowUser(followerId, followedId);

    if (!result) {
      throw new CustomError(USER_MESSAGES.NOT_FOLLOWING, StatusCodes.BAD_REQUEST);
    }

    res.status(StatusCodes.OK).json({ message: USER_MESSAGES.UNFOLLOW_SUCCESS });
  });

  // Get All Followers of a User
  getFollowers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const currentUserId = req.user?._id as string;

    if (!userId) {
      throw new CustomError(USER_MESSAGES.USER_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const followers = await this._followersService.getFollowers(userId as string, currentUserId);

    res.status(StatusCodes.OK).json(followers);
  });

  // Get All Followings of a User
  getFollowing = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    if (!userId) {
      throw new CustomError(USER_MESSAGES.USER_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const following = await this._followersService.getFollowing(userId as string);

    res.status(StatusCodes.OK).json(following);
  });

  getConnections = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    if (!userId) {
      throw new CustomError(USER_MESSAGES.USER_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const connections = await this._followersService.getConnections(userId as string);

    res.status(StatusCodes.OK).json(connections);
  });

  isFollowing = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { followerId, followedId } = req.body;

    if (!followerId || !followedId) {
      throw new CustomError(USER_MESSAGES.MISSING_PARAMS, StatusCodes.BAD_REQUEST);
    }

    const result = await this._followersService.isFollowing(
      followerId as string,
      followedId as string,
    );

    res.status(StatusCodes.OK).json(result);
  });

  getFollowStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    if (!userId) {
      throw new CustomError(USER_MESSAGES.USER_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const stats = await this._followersService.getFollowStats(userId as string);

    res.status(StatusCodes.OK).json(stats);
  });
}
