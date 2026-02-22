import { inject, injectable } from "inversify";

import type { IHistoryRepository } from "@/core/interfaces/repositories/i-history-repository";
import type { IHistoryService } from "@/core/interfaces/services/i-history-service";
import type { IHistory } from "@/models/user/history.model";

import { TYPES } from "@/di/types";

@injectable()
export class HistoryService implements IHistoryService {
  constructor(@inject(TYPES.HistoryRepository) private _historyRepository: IHistoryRepository) {}

  addHistory = async (userId: string, contentId: string): Promise<IHistory> => {
    return await this._historyRepository.addHistory(userId, contentId);
  };

  removeFromHistory = async (userId: string, contentId: string): Promise<IHistory> => {
    return await this._historyRepository.removeFromHistory(userId, contentId);
  };

  getAllHistory = async (userId: string): Promise<any> => {
    return await this._historyRepository.getAllHistory(userId);
  };
}
