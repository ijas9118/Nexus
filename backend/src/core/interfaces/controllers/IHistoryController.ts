import { Response } from "express";
import { CustomRequest } from "../../types/CustomRequest";

export interface IHistoryController {
  removeFromHistory(req: CustomRequest, res: Response): Promise<void>;
}
