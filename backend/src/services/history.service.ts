import { inject, injectable } from 'inversify';
import { IHistoryService } from '../core/interfaces/services/IHistoryService';
import { IHistory } from '../models/history.model';
import { TYPES } from '../di/types';
import { IHistoryRepository } from '../core/interfaces/repositories/IHistoryRepository';

@injectable()
export class HistoryService implements IHistoryService {
  constructor(@inject(TYPES.HistoryRepository) private historyRepository: IHistoryRepository) {}

  addHistory = async (userId: string, contentId: string): Promise<IHistory> => {
    return await this.historyRepository.addHistory(userId, contentId);
  };

  removeFromHistory = async (userId: string, contentId: string): Promise<IHistory> => {
    return await this.historyRepository.removeFromHistory(userId, contentId);
  };

  getAllHistory = async (userId: string) => {
    return await this.historyRepository.getAllHistory(userId);
  };
}
