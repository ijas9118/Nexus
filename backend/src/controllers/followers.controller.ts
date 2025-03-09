import { Request, Response } from 'express';
import { IFollowersController } from '../core/interfaces/controllers/IFollowersController';
import { CustomRequest } from '../core/types/CustomRequest';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { IFollowersService } from '../core/interfaces/services/IFollowersService';
import asyncHandler from 'express-async-handler';
import CustomError from '../utils/CustomError';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class FollowersController implements IFollowersController {
  constructor(@inject(TYPES.FollowersService) private followersService: IFollowersService) {}

  followUser = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const { followedId } = req.body;
    const followerId = req.user?._id as string;

    if (!followedId) {
      throw new CustomError('Followed user ID is required', StatusCodes.BAD_REQUEST);
    }

    const result = await this.followersService.followUser(followerId, followedId);

    if (!result) {
      throw new CustomError('Already following this user', StatusCodes.BAD_REQUEST);
    }

    res.status(StatusCodes.CREATED).json({ message: 'Followed successfully' });
  });

  unfollowUser = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const { followedId } = req.body;
    const followerId = req.user?._id as string;

    if (!followedId) {
      throw new CustomError('Followed user ID is required', StatusCodes.BAD_REQUEST);
    }

    const result = await this.followersService.unfollowUser(followerId, followedId);

    if (!result) {
      throw new CustomError('Not following this user', StatusCodes.BAD_REQUEST);
    }

    res.status(StatusCodes.OK).json({ message: 'Unfollowed successfully' });
  });

  getFollowers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    if (!userId) {
      throw new CustomError('User ID is required', StatusCodes.BAD_REQUEST);
    }

    const followers = await this.followersService.getFollowers(userId);

    res.status(StatusCodes.OK).json({ message: 'Followers fetched successfully', data: followers });
  });

  getFollowing = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    if (!userId) {
      throw new CustomError('User ID is required', StatusCodes.BAD_REQUEST);
    }

    const following = await this.followersService.getFollowing(userId);

    res
      .status(StatusCodes.OK)
      .json({ message: 'Following list fetched successfully', data: following });
  });

  isFollowing = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { followerId, followedId } = req.body;

    if (!followerId || !followedId) {
      throw new CustomError('Missing required query parameters', StatusCodes.BAD_REQUEST);
    }

    const result = await this.followersService.isFollowing(
      followerId as string,
      followedId as string
    );

    res.status(StatusCodes.OK).json(result);
  });
}
