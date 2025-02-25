import { Response } from "express";
import { CustomRequest } from "../../types/CustomRequest";

export interface IChatController {
  createChat: (req: CustomRequest, res: Response) => Promise<void>;
  getAllChats: (req: CustomRequest, res: Response) => Promise<void>;
}
