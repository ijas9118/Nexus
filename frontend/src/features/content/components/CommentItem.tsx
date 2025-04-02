import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { CommentActions } from "./CommentActions";
import { ReplyInput } from "./ReplyInput";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCommentInteraction } from "../hooks/useCommentInteraction";

dayjs.extend(relativeTime);

interface Comment {
  _id: string;
  contentId: string;
  userId: { _id: string; name: string; profilePic?: string; username: string };
  parentCommentId?: string;
  text: string;
  likes: string[];
  replies: Comment[];
  createdAt: string;
  isDeleted: boolean;
  status: string;
}

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  contentId: string;
}

export const CommentItem = ({
  comment,
  replies,
  contentId,
}: CommentItemProps) => {
  const {
    showReplyInput,
    replyText,
    setReplyText,
    handleSubmitReply,
    handleLike,
    handleReplyToggle,
    isSubmittingReply,
  } = useCommentInteraction(comment._id.toString(), contentId);

  return (
    <div className="mb-6">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={comment.userId.profilePic}
            alt={comment.userId.name}
          />
          <AvatarFallback>{comment.userId.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="mb-1 flex gap-2 items-center">
              <div className="font-medium">{comment.userId.name}</div>
              <span className="text-xs text-muted-foreground ">
                {dayjs(comment.createdAt).fromNow()}
              </span>
            </div>
            <p className="text-sm mb-2">{comment.text}</p>
            <CommentActions
              likes={comment.likes}
              onLike={handleLike}
              onReplyToggle={handleReplyToggle}
            />
          </div>

          {showReplyInput && (
            <ReplyInput
              to={comment.userId.username}
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmit={handleSubmitReply}
              onCancel={handleReplyToggle}
              isPending={isSubmittingReply}
            />
          )}

          {replies.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-muted">
              {replies.map((reply) => (
                <div key={reply._id} className="mb-3">
                  <div className="flex gap-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={reply.userId.profilePic}
                        alt={reply.userId.name}
                      />
                      <AvatarFallback>{reply.userId.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted/30 rounded-lg p-2">
                        <div className="mb-1 flex gap-2 items-center">
                          <div className="font-medium">{reply.userId.name}</div>
                          <span className="text-xs text-muted-foreground ">
                            {dayjs(reply.createdAt).fromNow()}
                          </span>
                        </div>
                        <p className="text-sm">{reply.text}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <CommentActions
                            likes={reply.likes}
                            onLike={() => console.log("Like reply:", reply._id)}
                            onReplyToggle={() =>
                              console.log("Reply to:", reply._id)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
