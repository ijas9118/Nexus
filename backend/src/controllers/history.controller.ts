import { Response } from "express";
import { IHistoryController } from "../core/interfaces/controllers/IHistoryController";
import { CustomRequest } from "../core/types/CustomRequest";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IHistoryService } from "../core/interfaces/services/IHistoryService";

@injectable()
export class HistoryController implements IHistoryController {
  constructor(@inject(TYPES.HistoryService) private historyService: IHistoryService) {}

  removeFromHistory = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id as string;
      const { contentId } = req.body;

      await this.historyService.removeFromHistory(userId, contentId);
      res.status(200).json({ message: "Removed from history" });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching squads", error: error.message });
    }
  };

  getAllHistory = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id as string;
      const history = await this.historyService.getAllHistory(userId);
      res.status(200).json(history);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: "Error fetching History", error: error.message });
    }
  };
}
