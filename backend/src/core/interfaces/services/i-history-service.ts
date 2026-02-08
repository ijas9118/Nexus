import type { IHistory } from "../../../models/history.model";

export interface IHistoryService {
  getAllHistory: (userId: string) => unknown;
  addHistory: (userId: string, contentId: string) => Promise<IHistory>;
  removeFromHistory: (userId: string, contentId: string) => Promise<IHistory>;
}
