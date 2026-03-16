import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { Separator } from "@/components/atoms/separator";
import CommentSection from "@/features/content/components/CommentSection";
import BookmarkService from "@/services/user/bookmarkService";
import { CommentService } from "@/services/user/commentService";
import VoteService from "@/services/voteService";
import type { Content } from "@/types/content";
import type { ApiError } from "@/types/error";

import { CommentInput } from "./components/CommentInput";
import { ContentBody } from "./components/ContentBody";
import { ContentHeader } from "./components/ContentHeader";
import { ContentLoadingSkeleton } from "./components/ContentLoadingSkeleton";
import { InteractionBar } from "./components/InteractionBar";
// import RelatedContent from "@/features/content/components/RelatedContent";
import { useContent } from "./hooks/useContent";

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

      queryClient.setQueryData<Content>(["content", id], (old) => {
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

  const bookmarkMutation = useMutation({
    mutationFn: () => BookmarkService.bookmarkContent(id as string),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["content", id] });
      const previousContent = queryClient.getQueryData(["content", id]);

      queryClient.setQueryData<Content>(["content", id], (old) => {
        if (!old) return old;
        return {
          ...old,
          isBookmarked: !old.isBookmarked,
        };
      });

      return { previousContent };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["content", id], context?.previousContent);
      toast.error("Failed to update bookmark");
    },
    onSuccess: (_data, _variables, context) => {
      const wasBookmarked = (context?.previousContent as Content)?.isBookmarked;
      if (wasBookmarked) {
        toast.success("Removed from bookmarks");
      } else {
        toast.success("Added to bookmarks");
      }
      queryClient.invalidateQueries({ queryKey: ["bookmarkedContent"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["content", id] });
    },
  });

  const handleBookmark = () => {
    bookmarkMutation.mutate();
  };

  if (isLoading) return <ContentLoadingSkeleton />;

  if (error || !content) {
    const errorData = error as ApiError;
    const isPremiumError =
      errorData?.statusCode === 403 ||
      errorData?.message?.includes("subscription");

    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center space-y-4 px-4">
        <div
          className={
            isPremiumError
              ? "text-orange-600 bg-orange-50 p-8 rounded-xl border border-orange-100 max-w-lg"
              : "text-destructive"
          }
        >
          <p className="text-xl font-semibold mb-2">
            {isPremiumError ? "Premium Content" : "Failed to load content"}
          </p>
          <p className="text-muted-foreground mb-6">
            {isPremiumError
              ? "This content is exclusive to premium members. Your current subscription may have expired or you need to upgrade to access this."
              : "Please try again later or contact support if the problem persists."}
          </p>
          {isPremiumError && (
            <button
              onClick={() => (window.location.href = "/getPremium")}
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
            >
              Unlock Premium Access
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl h-screen">
      <ContentHeader content={content} />
      <InteractionBar
        isUpvoted={!!content.isUpvoted}
        isDownvoted={!!content.isDownvoted}
        upvoteCount={content.upvoteCount ?? 0}
        downvoteCount={content.downvoteCount ?? 0}
        commentCount={content.commentCount ?? 0}
        viewCount={content.viewCount ?? 0}
        isBookmarked={!!content.isBookmarked}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
        onBookmark={handleBookmark}
      />

      <ContentBody
        thumbnailUrl={content.thumbnailUrl}
        title={content.title}
        content={content.content || ""}
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
