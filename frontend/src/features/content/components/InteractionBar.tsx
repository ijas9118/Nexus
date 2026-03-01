import { Button } from "@/components/atoms/button";
import {
  BookmarkIcon,
  EyeIcon,
  MessageCircleIcon,
  ShareIcon,
} from "lucide-react";
import {
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from "react-icons/bi";

interface InteractionBarProps {
  isUpvoted: boolean;
  isDownvoted: boolean;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  viewCount: number;
  isBookmarked: boolean;
  onUpvote: () => void;
  onDownvote: () => void;
  onBookmark: () => void;
}

export const InteractionBar = ({
  isUpvoted,
  isDownvoted,
  upvoteCount,
  downvoteCount,
  commentCount,
  viewCount,
  isBookmarked,
  onUpvote,
  onDownvote,
  onBookmark,
}: InteractionBarProps) => (
  <div className="flex items-center justify-between py-3 border-y mb-6">
    <div className="flex items-center gap-4">
      <div className="border border-muted flex items-center rounded-lg overflow-hidden gap-2">
        <button
          onClick={onUpvote}
          className="py-2 px-3 hover:bg-muted transition-all duration-300"
        >
          {isUpvoted ? (
            <BiSolidUpvote className="text-emerald-400 dark:text-emerald-500" />
          ) : (
            <BiUpvote className="text-muted-foreground" />
          )}
        </button>

        <div className="text-sm">{upvoteCount - downvoteCount}</div>

        <button
          onClick={onDownvote}
          className="py-2 px-3 hover:bg-muted transition-all duration-300"
        >
          {isDownvoted ? (
            <BiSolidDownvote className="text-pink-400 dark:text-pink-500" />
          ) : (
            <BiDownvote className="text-muted-foreground" />
          )}
        </button>
      </div>
      <Button variant="ghost" size="sm" className="flex items-center gap-2">
        <MessageCircleIcon className="h-5 w-5" />
        <span>{commentCount}</span>
        <span>Comments</span>
      </Button>
      <div className="flex items-center gap-2">
        <EyeIcon className="h-4 w-4" />
        <span className="text-sm">
          {viewCount === 0
            ? "No views yet"
            : `${viewCount} ${viewCount === 1 ? "view" : "views"}`}
        </span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={onBookmark}
      >
        <BookmarkIcon
          className={`h-5 w-5 ${isBookmarked ? "fill-primary text-primary" : ""}`}
        />
        <span className="sr-only md:not-sr-only">
          {isBookmarked ? "Saved" : "Save"}
        </span>
      </Button>
      <Button variant="ghost" size="sm" className="flex items-center gap-2">
        <ShareIcon className="h-5 w-5" />
        <span className="sr-only md:not-sr-only">Share</span>
      </Button>
    </div>
  </div>
);
