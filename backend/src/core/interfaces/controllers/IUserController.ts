import type { Response } from "express";
import { CustomRequest } from "../../types/CustomRequest";

export interface IUserController {
  getUserJoinedSquads(req: CustomRequest, res: Response): Promise<void>;
}
