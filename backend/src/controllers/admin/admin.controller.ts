import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IAdminController } from "@/core/interfaces/controllers/admin/i-admin-controller";
import type { IUserService } from "@/core/interfaces/services/i-user-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { ADMIN_MESSAGES } = MESSAGES;

@injectable()
export class AdminController implements IAdminController {
  constructor(@inject(TYPES.UserService) private userService: IUserService) {}

  getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = Number.parseInt(req.query.page as string) || 1;
    const limit = Number.parseInt(req.query.limit as string) || 10;

    const result = await this.userService.getUsers(page, limit);
    res.status(StatusCodes.OK).json({
      data: result.users,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  });

  getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await this.userService.getUserById(id as string);
    if (!user) {
      throw new CustomError(ADMIN_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(user);
  });

  updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updatedUser = await this.userService.updateUser(req.params.id as string, req.body);
    if (!updatedUser) {
      throw new CustomError(ADMIN_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(updatedUser);
  });

  blockUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id as string;
    await this.userService.blockUser(userId);
    res.status(StatusCodes.OK).json({ message: ADMIN_MESSAGES.USER_BLOCKED });
  });

  unblockUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id as string;
    await this.userService.unblockUser(userId);
    res.status(StatusCodes.OK).json({ message: ADMIN_MESSAGES.USER_UNBLOCKED });
  });
}
