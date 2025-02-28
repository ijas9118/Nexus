import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { CustomRequest } from "../core/types/CustomRequest";
import { IUserController } from "../core/interfaces/controllers/IUserController";
import { IUserService } from "../core/interfaces/services/IUserService";
import asyncHandler from "express-async-handler";
import CustomError from "../utils/CustomError";
import { StatusCodes } from "http-status-codes";

@injectable()
export class UserController implements IUserController {
  constructor(@inject(TYPES.UserService) private userService: IUserService) {}

  getUserJoinedSquads = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
      const userId = req.user?._id as string;
      const squads = await this.userService.getUserJoinedSquads(userId);
      res.status(StatusCodes.OK).json(squads);
    }
  );

  getUserData = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    const userData = await this.userService.getUserByUsername(username);
    res.status(StatusCodes.OK).json(userData);
  });

  updateUser = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const result = await this.userService.updateUser(userId, req.body);
    res.status(StatusCodes.OK).json(result);
  });

  updatePassword = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
      const userId = req.user?._id as string;
      if (!userId) {
        throw new CustomError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }

      await this.userService.updatePassword(userId, req.body);
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "Password updated successfully" });
    }
  );
}
