import { CommentService } from "@/services/user/commentService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

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
    onError: (error: any) => {
      toast.error(`Failed to post reply: ${error.message || "Unknown error"}`);
    },
  });

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      mutation.mutate(replyText);
    }
  };

  const handleLike = () => {
    // API call to like/unlike comment would go here
    console.log("Like/unlike comment:", commentId);
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
