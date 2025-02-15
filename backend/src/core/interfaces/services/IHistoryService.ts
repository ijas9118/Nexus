import { IHistory } from "../../../models/history.model";

export interface IHistoryService {
  addHistory(userId: string, contentId: string): Promise<IHistory>;
  removeFromHistory(userId: string, contentId: string): Promise<IHistory>;
}
