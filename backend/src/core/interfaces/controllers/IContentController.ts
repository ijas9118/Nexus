import type { Request, Response } from "express";

export interface IContentController {
  createContent(req: Request, res: Response): Promise<void>;
  getContent(req: Request, res: Response): Promise<void>;
  getAllContent(req: Request, res: Response): Promise<void>;
  likeContent(req: Request, res: Response): Promise<void>;
  unlikeContent(req: Request, res: Response): Promise<void>;
}
