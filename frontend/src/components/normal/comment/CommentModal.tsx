import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CommentService } from "@/services/user/commentService";

const CommentModal = ({ contentId }: { contentId: string }) => {
  const {
    data: comments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comments", contentId],
    queryFn: () => CommentService.getCommentsByContentId(contentId),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          {comments?.length}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogTitle>
          <div className="flex justify-start gap-4 items-center">
            <h2 className="text-xl font-bold">Comments</h2>
            <Badge className="rounded-full px-2 py-0.5 text-xs">{comments?.length}</Badge>
          </div>
        </DialogTitle>
        <DialogDescription>View and add comments for this content.</DialogDescription>
        <div className="space-y-4 pt-3">
          <CommentInput contentId={contentId} />
          <Separator />
          <div className="space-y-6">
            {isLoading ? (
              <p>Loading comments...</p>
            ) : isError ? (
              <p>Failed to load comments</p>
            ) : (
              <>
                {comments?.map((comment: any, index: number) => (
                  <CommentItem key={comment.id || index} comment={comment} />
                ))}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;
