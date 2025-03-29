export interface AddCommentParams {
  userId: string;
  contentId: string;
  text: string;
  parentCommentId?: string; // Optional
}
