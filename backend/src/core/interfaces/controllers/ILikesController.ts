import { Request, Response } from "express";

export interface ILikesController {
  toggleLike(req: Request, res: Response): Promise<void>;
  getLikesByContent(req: Request, res: Response): Promise<void>;
}
