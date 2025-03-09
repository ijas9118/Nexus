export interface ILikeService {
  toggleLike(
    contentId: string,
    userId: string
  ): Promise<{ status: boolean; likeCount: number | undefined }>;
  getLikedContentsId(userId: string): Promise<Set<string>>;
}
