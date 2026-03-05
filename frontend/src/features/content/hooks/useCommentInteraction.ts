import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { CommentService } from "@/services/user/commentService";

export const useCommentInteraction = (commentId: string, contentId: string) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (text: string) =>
      CommentService.addComment(contentId, text, commentId),
    onSuccess: () => {
      toast.success("Reply posted successfully!");
      setReplyText("");
      setShowReplyInput(false);
      queryClient.invalidateQueries({ queryKey: ["comments", contentId] }); // Refresh comments
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to post reply: ${message || "Unknown error"}`);
    },
  });

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      mutation.mutate(replyText);
    }
  };

  const handleLike = () => {
    // API call to like/unlike comment would go here
  };

  const handleReplyToggle = () => setShowReplyInput((prev) => !prev);

  return {
    showReplyInput,
    replyText,
    setReplyText,
    handleSubmitReply,
    handleLike,
    handleReplyToggle,
    isSubmittingReply: mutation.isPending,
  };
};
