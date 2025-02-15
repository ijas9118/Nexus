import { IHistory } from "../../../models/history.model";

export interface IHistoryRepository {
  addHistory(userId: string, contentId: string): Promise<IHistory>;
  removeFromHistory(userId: string, contentId: string): Promise<IHistory>;
}
