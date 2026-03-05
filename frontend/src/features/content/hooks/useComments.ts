import { useQuery } from "@tanstack/react-query";

import { CommentService } from "@/services/user/commentService";
import type { Comment } from "@/types/comment";

export const useComments = (contentId: string) => {
  return useQuery<Comment[]>({
    queryKey: ["comments", contentId],
    queryFn: () => CommentService.getCommentsByContentId(contentId),
  });
};
