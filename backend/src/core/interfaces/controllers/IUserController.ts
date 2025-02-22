import type { Request, Response } from "express";
import { CustomRequest } from "../../types/CustomRequest";

export interface IUserController {
  getUserJoinedSquads(req: CustomRequest, res: Response): Promise<void>;
  getUserData(req: Request, res: Response): Promise<void>;
  updateUser(req: CustomRequest, res: Response): Promise<void>;
}
