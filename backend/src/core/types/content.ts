import type { IContent } from "@/models/content/content.model";

export type EnrichedContent = IContent & {
  isUpvoted: boolean;
  isDownvoted: boolean;
  isBookmarked: boolean;
  isFollowing: boolean;
  isConnected: boolean;
  authorName: string;
  authorUsername: string;
  authorProfilePic: string;
  authorRole: string;
  createdAt: string;
};
