import { IHistory } from '../../../models/history.model';

export interface IHistoryRepository {
  getAllHistory(userId: string): unknown;
  addHistory(userId: string, contentId: string): Promise<IHistory>;
  removeFromHistory(userId: string, contentId: string): Promise<IHistory>;
}
