import type { Express, Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IUserController } from "@/core/interfaces/controllers/i-user-controller";
import type { IUserService } from "@/core/interfaces/services/i-user-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { USER_MESSAGES } = MESSAGES;

@injectable()
export class UserController implements IUserController {
  constructor(@inject(TYPES.UserService) private userService: IUserService) {}

  getUserJoinedSquads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const squads = await this.userService.getUserJoinedSquads(userId);
    res.status(StatusCodes.OK).json(squads);
  });

  getUserData = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    const userData = await this.userService.getUserByUsername(username as string);
    res.status(StatusCodes.OK).json(userData);
  });

  updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const result = await this.userService.updateUser(userId, req.body);
    res.status(StatusCodes.OK).json(result);
  });

  updatePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    if (!userId) {
      throw new CustomError(USER_MESSAGES.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
    }

    await this.userService.updatePassword(userId, req.body);
    res.status(StatusCodes.OK).json({ success: true, message: USER_MESSAGES.PASSWORD_UPDATED });
  });

  updateProfilePic = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const file = req.file as Express.Multer.File;

    if (!file) {
      throw new CustomError(USER_MESSAGES.NO_FILE, StatusCodes.BAD_REQUEST);
    }

    const updatedUser = await this.userService.updateProfilePic(userId, {}, file);

    res.status(StatusCodes.OK).json({ id: updatedUser._id, profilePic: updatedUser.profilePic });
  });

  getUserContents = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const username = req.body.username;

    if (!username) {
      throw new CustomError(USER_MESSAGES.USERNAME_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const contents = await this.userService.getUserContents(username);
    res.status(StatusCodes.OK).json(contents);
  });

  validateUsername = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const username = req.params.username as string;

    const status = await this.userService.validateUsername(username);
    res.status(StatusCodes.OK).json({ status });
  });
}
