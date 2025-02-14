import mongoose from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { HistoryModel, IHistory } from "../models/history.model";
import { IHistoryRepository } from "../core/interfaces/repositories/IHistoryRepository";
import { injectable } from "inversify";

@injectable()
export class HistoryRepository
  extends BaseRepository<IHistory>
  implements IHistoryRepository
{
  constructor() {
    super(HistoryModel);
  }

  addHistory = async (userId: string, contentId: string): Promise<IHistory> => {
    const userObjId = new mongoose.Types.ObjectId(userId);
    const contentObjId = new mongoose.Types.ObjectId(contentId);

    return await this.findOneAndUpdate(userObjId, {
      $addToSet: { readHistory: contentObjId },
    });
  };

  removeFromHistory = async (userId: string, contentId: string): Promise<IHistory> => {
    const userObjId = new mongoose.Types.ObjectId(userId);
    const contentObjId = new mongoose.Types.ObjectId(contentId);

    return await this.findOneAndUpdate(userObjId, {
      $pull: { readHistory: contentObjId },
    });
  };
}
