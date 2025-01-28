import { Request, Response } from "express";
import { ILikesController } from "../core/interfaces/controllers/ILikesController";
import { LikeService } from "../services/like.service";
import { CustomRequest } from "../core/types/CustomRequest";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";

@injectable()
export class LikesController implements ILikesController {
  constructor(@inject(TYPES.LikesService) private likeService: LikeService) {}

  async toggleLike(req: CustomRequest, res: Response): Promise<void> {
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
  }

  async getLikesByContent(req: Request, res: Response): Promise<void> {
    try {
      const { id: contentId } = req.params;

      const likes = await this.likeService.getLikesByContent(contentId);
      res.status(200).json({ likes });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
