import { useParams } from "react-router-dom";
import { Separator } from "@/components/atoms/separator";
import CommentSection from "@/features/content/components/CommentSection";
import RelatedContent from "@/features/content/components/RelatedContent";
import { useContent } from "./hooks/useContent";
import { useInteraction } from "./hooks/useInteraction";
import { ContentLoadingSkeleton } from "./components/ContentLoadingSkeleton";
import { ContentHeader } from "./components/ContentHeader";
import { InteractionBar } from "./components/InteractionBar";
import { ContentBody } from "./components/ContentBody";
import { CommentInput } from "./components/CommentInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentService } from "@/services/user/commentService";
import { toast } from "sonner";

export default function ContentDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: content, isLoading, error } = useContent(id);
  const { isLiked, isBookmarked, handleLike, handleBookmark } = useInteraction(
    content?.likeCount,
  );

  const queryClient = useQueryClient();

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
    onError: (error: any) => {
      toast.error(
        `Failed to post comment: ${error.message || "Unknown error"}`,
      );
    },
  });

  const handleSubmitComment = (comment: string) => {
    mutation.mutate({ text: comment });
  };

  if (isLoading) return <ContentLoadingSkeleton />;
  if (error || !content)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-destructive">
          Failed to load content. Please try again later.
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl h-screen">
      <ContentHeader content={content} />
      <InteractionBar
        likeCount={content.likeCount}
        commentCount={content.commentCount}
        isLiked={isLiked}
        isBookmarked={isBookmarked}
        onLike={handleLike}
        onBookmark={handleBookmark}
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
        <RelatedContent
          authorId={content.author?._id}
          currentContentId={id as string}
        />
      </div>
    </div>
  );
}
