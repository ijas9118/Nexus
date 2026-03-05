export interface IHistoryItem {
  contentId: string;
  contentType: "blog" | "video";
  date: string;
  isPremium: boolean;
  squad: string;
  thumbnailUrl: string;
  title: string;
  userName: string;
  readAt: string;
}

export interface Content {
  _id: string;
  avatarFallback: string;
  author: {
    _id: string;
    name: string;
    username: string;
    profilePic?: string;
    role?: string;
  };
  userName: string;
  contentType: "blog" | "video";
  title: string;
  date: string;
  upvoteCount: number;
  downvoteCount: number;
  squad: {
    _id: string;
    name: string;
  };
  isPremium: boolean;
  thumbnailUrl: string;
  videoUrl?: string;
  content?: string;
  commentCount: number;
  bookmarkCount: number;
  viewCount: number;
  isVerified: boolean;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
  isBookmarked?: boolean;
  isFollowing?: boolean;
  isConnected?: boolean;
  name?: string;
  username?: string;
  profilePic?: string;
  createdAt: string;
  updatedAt: string;
}
