import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import {
  Check,
  MoreHorizontal,
  Reply,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

const CommentItem = ({ comment }: { comment: any }) => {
  console.log(comment);
  return (
    <div key={comment.id} className="flex gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={comment.userId.profilePic} />
        <AvatarFallback>{comment.userId.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{comment.userId.name}</span>
          {comment.userId?.isVarified && (
            <div className="bg-blue-500 text-white rounded-full p-0.5">
              <Check className="h-3 w-3" />
            </div>
          )}
          <span className="text-xs">10:21 AM</span>
        </div>
        <p className="mt-1">{comment.text}</p>
        <div className="flex items-center gap-1 mt-2">
          <Button variant="ghost">
            <ThumbsUp />
            <span>{comment.likes}</span>
          </Button>
          <Button variant="ghost">
            <ThumbsDown />
            <span>{comment.dislikes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Reply className="h-4 w-4" />
            <span>Reply</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
