import { Request, Response } from 'express';
import { IAdminController } from '../../core/interfaces/controllers/admin/IAdminController';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { IUserService } from '../../core/interfaces/services/IUserService';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../../utils/CustomError';
import asyncHandler from 'express-async-handler';
import redisClient from '@/config/redisClient.config';

@injectable()
export class AdminController implements IAdminController {
  constructor(@inject(TYPES.UserService) private userService: IUserService) {}

  getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { users, total } = await this.userService.getUsers(page, limit);
    res.status(StatusCodes.OK).json({
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  });

  getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.getUserById(req.params.id);
    if (!user) {
      throw new CustomError('User not found', StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(user);
  });

  updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updatedUser = await this.userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      throw new CustomError('User not found', StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(updatedUser);
  });

  blockUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    const updatedUser = await this.userService.updateUser(userId, { isBlocked: true });
    if (!updatedUser) {
      throw new CustomError('User not found', StatusCodes.NOT_FOUND);
    }

    await redisClient.set(`blocked_user:${userId}`, 1, 'EX', 7 * 24 * 60 * 60);

    res.status(StatusCodes.OK).json({ message: 'User blocked successfully' });
  });

  unblockUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    const updatedUser = await this.userService.updateUser(userId, { isBlocked: false });
    if (!updatedUser) {
      throw new CustomError('User not found', StatusCodes.NOT_FOUND);
    }
    await redisClient.del(`blocked_user:${userId}`);
    res.status(StatusCodes.OK).json({ message: 'User unblocked successfully' });
  });
}
