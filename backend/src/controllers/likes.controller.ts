import { Response } from "express";
import { ILikesController } from "../core/interfaces/controllers/ILikesController";
import { CustomRequest } from "../core/types/CustomRequest";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { ILikeService } from "../core/interfaces/services/ILikeService";
import asyncHandler from "express-async-handler";

@injectable()
export class LikesController implements ILikesController {
  constructor(@inject(TYPES.LikesService) private likeService: ILikeService) {}

  toggleLike = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { id: contentId } = req.params;
      const userId = req.user?._id;

      if (!userId) {
        res.status(400).json({ message: "User is not authenticated" });
        return;
      }

      const result = await this.likeService.toggleLike(contentId, userId);
      res.status(200).json({ ...result });
    } catch (error) {
      res.status(500).json({ message: "Error toggling like", error });
    }
  });
}
