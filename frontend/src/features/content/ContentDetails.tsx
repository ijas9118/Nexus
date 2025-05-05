import { useParams } from "react-router-dom";
import { Separator } from "@/components/atoms/separator";
import CommentSection from "@/features/content/components/CommentSection";
// import RelatedContent from "@/features/content/components/RelatedContent";
import { useContent } from "./hooks/useContent";
import { ContentLoadingSkeleton } from "./components/ContentLoadingSkeleton";
import { ContentHeader } from "./components/ContentHeader";
import { InteractionBar } from "./components/InteractionBar";
import { ContentBody } from "./components/ContentBody";
import { CommentInput } from "./components/CommentInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentService } from "@/services/user/commentService";
import { toast } from "sonner";
import VoteService from "@/services/voteService";

export default function ContentDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: content, isLoading, error } = useContent(id);
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: ({ voteType }: { voteType: "upvote" | "downvote" }) =>
      VoteService.voteContent(id as string, voteType),
    onMutate: async ({ voteType }) => {
      await queryClient.cancelQueries({ queryKey: ["content", id] });

      const previousContent = queryClient.getQueryData(["content", id]);

      queryClient.setQueryData(["content", id], (old: any) => {
        if (!old) return old;
        let upvoteCount = old.upvoteCount || 0;
        let downvoteCount = old.downvoteCount || 0;
        let isUpvoted = old.isUpvoted;
        let isDownvoted = old.isDownvoted;

        if (voteType === "upvote") {
          if (isUpvoted) {
            upvoteCount -= 1;
            isUpvoted = false;
          } else {
            upvoteCount += 1;
            if (isDownvoted) {
              downvoteCount -= 1;
            }
            isUpvoted = true;
            isDownvoted = false;
          }
        } else if (voteType === "downvote") {
          if (isDownvoted) {
            downvoteCount -= 1;
            isDownvoted = false;
          } else {
            downvoteCount += 1;
            if (isUpvoted) {
              upvoteCount -= 1;
            }
            isDownvoted = true;
            isUpvoted = false;
          }
        }

        return {
          ...old,
          upvoteCount,
          downvoteCount,
          isUpvoted,
          isDownvoted,
        };
      });

      return { previousContent };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["content", id], context?.previousContent);
      toast.error("Failed to update vote. Try again?");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["content", id] });
    },
  });

  const handleUpvote = () => {
    voteMutation.mutate({ voteType: "upvote" });
  };

  const handleDownvote = () => {
    voteMutation.mutate({ voteType: "downvote" });
  };

  const mutation = useMutation({
    mutationFn: ({
      text,
      parentCommentId,
    }: {
      text: string;
      parentCommentId?: string;
    }) => CommentService.addComment(id as string, text, parentCommentId),
    onSuccess: () => {
      toast.success("Comment posted successfully!");
      queryClient.invalidateQueries({ queryKey: ["comments", id] }); // Refresh comments
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to post comment: ${errorMessage}`);
    },
  });

  const handleSubmitComment = (comment: string) => {
    mutation.mutate({ text: comment });
  };

  if (isLoading) return <ContentLoadingSkeleton />;
  if (error || !content) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-destructive">
          Failed to load content. Please try again later.
        </div>
      </div>
    );
  }

  console.log(content);
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl h-screen">
      <ContentHeader content={content} />
      <InteractionBar
        isUpvoted={content.isUpvoted}
        isDownvoted={content.isDownvoted}
        upvoteCount={content.upvoteCount ?? 0}
        downvoteCount={content.downvoteCount ?? 0}
        commentCount={content.commentCount ?? 0}
        viewCount={content.viewCount ?? 0}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
      />

      <ContentBody
        thumbnailUrl={content.thumbnailUrl}
        title={content.title}
        content={content.content}
      />
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        <CommentInput
          onSubmit={handleSubmitComment}
          isPending={mutation.isPending}
        />
        <CommentSection contentId={id as string} />
      </div>
      <div className="mt-16">
        <Separator className="mb-8" />
        <h3 className="text-2xl font-semibold mb-6">
          More from {content.userName}
        </h3>
        {/* <RelatedContent
          authorId={content.author?._id}
          currentContentId={id as string}
        /> */}
      </div>
    </div>
  );
}
