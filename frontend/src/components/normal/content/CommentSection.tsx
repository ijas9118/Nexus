import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUpIcon, ReplyIcon, MoreHorizontalIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock function to get comments - replace with your actual API call
const getComments = async (contentId: string) => {
  // This would be your actual API call
  // return await fetchComments(contentId);

  // Mock data for demonstration
  return [
    {
      _id: "1",
      contentId,
      userId: {
        _id: "user1",
        name: "Jane Cooper",
        profilePic: "https://avatar.iran.liara.run/public/1",
      },
      text: "This is a fantastic article! I especially liked the part about...",
      likes: ["user2", "user3"],
      replies: ["2"],
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      isDeleted: false,
      status: "active",
    },
    {
      _id: "2",
      contentId,
      parentCommentId: "1",
      userId: {
        _id: "user2",
        name: "Alex Johnson",
        profilePic: "https://avatar.iran.liara.run/public/2",
      },
      text: "I agree! The author made some excellent points.",
      likes: ["user1"],
      replies: [],
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      isDeleted: false,
      status: "active",
    },
    {
      _id: "3",
      contentId,
      userId: {
        _id: "user3",
        name: "Sam Wilson",
        profilePic: "https://avatar.iran.liara.run/public/3",
      },
      text: "I have a different perspective on this topic. I think...",
      likes: [],
      replies: [],
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      isDeleted: false,
      status: "active",
    },
  ];
};

interface Comment {
  _id: string;
  contentId: string;
  userId: {
    _id: string;
    name: string;
    profilePic?: string;
  };
  parentCommentId?: string;
  text: string;
  likes: string[];
  replies: string[];
  createdAt: string;
  isDeleted: boolean;
  status: string;
}

interface CommentProps {
  comment: Comment;
  replies: Comment[];
  onReply: (parentId: string) => void;
  onLike: (commentId: string) => void;
}

const CommentItem = ({ comment, replies, onReply, onLike }: CommentProps) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const isLiked = comment.likes.length > 0; // In a real app, check if current user ID is in likes array

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      // API call to submit reply would go here
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

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
            <div className="flex justify-between items-start mb-1">
              <div className="font-medium">{comment.userId.name}</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm mb-2">{comment.text}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{timeAgo}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => onLike(comment._id)}
              >
                <ThumbsUpIcon
                  className={`h-3.5 w-3.5 mr-1 ${isLiked ? "fill-primary text-primary" : ""}`}
                />
                {comment.likes.length > 0 && comment.likes.length}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                <ReplyIcon className="h-3.5 w-3.5 mr-1" />
                Reply
              </Button>
            </div>
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="mb-2 resize-none text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowReplyInput(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim()}
                >
                  Reply
                </Button>
              </div>
            </div>
          )}

          {/* Nested Replies */}
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
                        <div className="font-medium text-sm">
                          {reply.userId.name}
                        </div>
                        <p className="text-sm">{reply.text}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>
                            {formatDistanceToNow(new Date(reply.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-1.5 text-xs"
                            onClick={() => onLike(reply._id)}
                          >
                            <ThumbsUpIcon
                              className={`h-3 w-3 mr-1 ${reply.likes.length > 0 ? "fill-primary text-primary" : ""}`}
                            />
                            {reply.likes.length > 0 && reply.likes.length}
                          </Button>
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

export default function CommentSection({ contentId }: { contentId: string }) {
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", contentId],
    queryFn: () => getComments(contentId),
  });

  const handleReply = (parentId: string) => {
    // This would be handled by the CommentItem component
    console.log("Reply to comment:", parentId);
  };

  const handleLike = (commentId: string) => {
    // API call to like/unlike comment would go here
    console.log("Like/unlike comment:", commentId);
  };

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

  // Separate top-level comments and replies
  const topLevelComments = comments.filter(
    (comment) => !comment.parentCommentId,
  );

  return (
    <div>
      {topLevelComments.map((comment) => {
        const commentReplies = comments.filter(
          (reply) => reply.parentCommentId === comment._id,
        );

        return (
          <CommentItem
            key={comment._id}
            comment={comment}
            replies={commentReplies}
            onReply={handleReply}
            onLike={handleLike}
          />
        );
      })}
    </div>
  );
}
