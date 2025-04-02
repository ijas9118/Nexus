import { useComments } from "../hooks/useComments";
import { CommentItem } from "./CommentItem";

interface CommentSectionProps {
  contentId: string;
}

export default function CommentSection({ contentId }: CommentSectionProps) {
  const { data: comments, isLoading, error } = useComments(contentId);

  console.log(comments);

  if (isLoading)
    return <div className="text-center py-4">Loading comments...</div>;
  if (error)
    return (
      <div className="text-center py-4 text-destructive">
        Failed to load comments
      </div>
    );
  if (!comments || comments.length === 0)
    return (
      <div className="text-center py-4 text-muted-foreground">
        No comments yet. Be the first to comment!
      </div>
    );

  const topLevelComments = comments.filter(
    (comment: any) => !comment.parentCommentId,
  );

  return (
    <div>
      {topLevelComments.map((comment: any) => (
        <CommentItem
          key={comment._id.toString()}
          comment={comment}
          replies={comment.replies}
          contentId={contentId}
        />
      ))}
    </div>
  );
}
