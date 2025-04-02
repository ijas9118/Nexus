import { Button } from "@/components/atoms/button";
import { ThumbsUpIcon, ReplyIcon, MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";

interface CommentActionsProps {
  likes: string[];
  onLike: () => void;
  onReplyToggle: () => void;
}

export const CommentActions = ({
  likes,
  onLike,
  onReplyToggle,
}: CommentActionsProps) => {
  const isLiked = likes.length > 0; // Replace with actual user-specific check in production

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs"
        onClick={onLike}
      >
        <ThumbsUpIcon
          className={`h-3.5 w-3.5 mr-1 ${isLiked ? "fill-primary text-primary" : ""}`}
        />
        {likes.length > 0 && likes.length}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs"
        onClick={onReplyToggle}
      >
        <ReplyIcon className="h-3.5 w-3.5 mr-1" />
        Reply
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Report</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
