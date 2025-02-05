import { Request, Response } from "express";

export interface ICategoryController {
  createCategory(req: Request, res: Response): Promise<void>;
  updateCategory(req: Request, res: Response): Promise<void>;
  toggleCategory(req: Request, res: Response): Promise<void>;
}
