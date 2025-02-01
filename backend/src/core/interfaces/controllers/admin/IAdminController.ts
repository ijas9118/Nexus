import { Request, Response } from "express";

export interface IAdminController {
  getUsers(req: Request, res: Response): Promise<void>;
  getUserById(req: Request, res: Response): Promise<void>;
  updateUser(req: Request, res: Response): Promise<void>;
}
