import type { Request, Response } from "express";
import { CustomRequest } from "../../types/CustomRequest";

export interface IContentController {
  createContent(req: CustomRequest, res: Response): Promise<void>;
  getContent(req: Request, res: Response): Promise<void>;
  getAllContent(req: Request, res: Response): Promise<void>;
  likeContent(req: Request, res: Response): Promise<void>;
  unlikeContent(req: Request, res: Response): Promise<void>;
}
