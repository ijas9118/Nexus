import { Response } from "express";
import { IHistoryController } from "../core/interfaces/controllers/IHistoryController";
import { CustomRequest } from "../core/types/CustomRequest";
import { HistoryService } from "../services/history.service";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";

@injectable()
export class HistoryController implements IHistoryController {
  constructor(@inject(TYPES.HistoryService) private historyService: HistoryService) {}

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
}
