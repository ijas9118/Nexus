import { Response } from "express";
import { ILikesController } from "../core/interfaces/controllers/ILikesController";
import { CustomRequest } from "../core/types/CustomRequest";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { ILikeService } from "../core/interfaces/services/ILikeService";
import asyncHandler from "express-async-handler";
import CustomError from "../utils/CustomError";
import { StatusCodes } from "http-status-codes";

@injectable()
export class LikesController implements ILikesController {
  constructor(@inject(TYPES.LikesService) private likeService: ILikeService) {}

  toggleLike = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const { id: contentId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      throw new CustomError("User is not authenticated", StatusCodes.UNAUTHORIZED);
    }

    const result = await this.likeService.toggleLike(contentId, userId);

    if (!result) {
      throw new CustomError("Failed to toggle like", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).json({ ...result });
  });
}
