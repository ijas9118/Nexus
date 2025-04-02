import { CommentService } from "@/services/user/commentService";
import { useQuery } from "@tanstack/react-query";

export const useComments = (contentId: string) => {
  return useQuery({
    queryKey: ["comments", contentId],
    queryFn: () => CommentService.getCommentsByContentId(contentId),
  });
};
