import { Button } from "@/components/atoms/button";
import {
  BookmarkIcon,
  MessageCircleIcon,
  ShareIcon,
  ThumbsUpIcon,
} from "lucide-react";

interface InteractionBarProps {
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
}

export const InteractionBar = ({
  likeCount,
  commentCount,
  isLiked,
  isBookmarked,
  onLike,
  onBookmark,
}: InteractionBarProps) => (
  <div className="flex items-center justify-between py-3 border-y mb-6">
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={onLike}
      >
        <ThumbsUpIcon
          className={`h-5 w-5 ${isLiked ? "fill-primary text-primary" : ""}`}
        />
        <span>{likeCount || 0}</span>
        <span>{isLiked ? "Liked" : "Like"}</span>
      </Button>
      <Button variant="ghost" size="sm" className="flex items-center gap-2">
        <MessageCircleIcon className="h-5 w-5" />
        <span>{commentCount || 0}</span>
        <span>Comments</span>
      </Button>
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
