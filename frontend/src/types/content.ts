export interface IHistoryItem {
  contentId: string;
  contentType: "Blog" | "Video";
  date: string;
  isPremium: boolean;
  squad: string;
  thumbnailUrl: string;
  title: string;
  userName: string;
  readAt: string;
}
