import { Response } from "express";
import { CustomRequest } from "../../types/CustomRequest";

export interface IBookmarkController {
  toggleBookmark(req: CustomRequest, res: Response): Promise<void>;
}
