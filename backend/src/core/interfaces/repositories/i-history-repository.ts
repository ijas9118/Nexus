import type { IHistory } from "@/models/user/history.model";

export interface IHistoryRepository {
  getAllHistory: (userId: string) => unknown;
  addHistory: (userId: string, contentId: string) => Promise<IHistory>;
  removeFromHistory: (userId: string, contentId: string) => Promise<IHistory>;
}
