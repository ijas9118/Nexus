export interface IContentViewService {
  handleContentView(userId: string, contentId: string): Promise<void>;
  getContentViewCount(contentId: string): Promise<number>;
}
