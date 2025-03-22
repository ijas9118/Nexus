import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CommentToolbar from "./CommentToolbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentService } from "@/services/user/commentService";

const CommentInput = ({ contentId }: { contentId: string }) => {
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment: string) =>
      CommentService.addComment(contentId, newComment),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", contentId] });
    },
    onError: (error) => {
      console.error("Failed to add comment:", error);
    },
  });

  return (
    <div className="p-4 rounded-lg border">
      <Textarea
        placeholder="Add comment..."
        className="min-h-[100px] bg-transparent border-none shadow-none focus-visible:ring-0 resize-none p-0 placeholder:text-muted-foreground"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <div className="flex justify-between items-center mt-2">
        <CommentToolbar />
        <Button
          className="rounded-full px-6"
          disabled={!commentText.trim() || mutation.isPending}
          onClick={() => mutation.mutate(commentText)}
        >
          {mutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default CommentInput;
