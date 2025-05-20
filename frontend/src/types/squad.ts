export interface Squad {
  _id: string;
  name: string;
  category: string;
  members: string[];
  isActive: boolean;
  logo: string;
  description?: string;
  handle: string;
  membersCount: number;
  isJoined?: boolean;
  isPremium: boolean;
}

export interface SquadDetail {
  _id: string;
  name: string;
  description: string;
  handle: string;
  logo: string;
  postCount: number;
  viewCount: number;
  upvoteCount: number;
  membersCount: number;
  isActive: boolean;
  isPremium: boolean;
  createdAt: string;
  category: string;
  admin: string;
  adminName: string;
  adminUsername: string;
  adminProfilePic: string;
}

export interface SquadContent {
  _id: string;
  author: string;
  contentType: string;
  title: string;
  upvoteCount: number;
  downvoteCount: number;
  squad: string;
  isPremium: boolean;
  thumbnailUrl?: string;
  videoUrl?: string | null;
  content: string;
  commentCount: number;
  bookmarkCount: number;
  viewCount: number;
  isVerified: boolean;
  createdAt: string;
  isUpvoted: boolean;
  isDownvoted: boolean;
  isBookmarked: boolean;
  isFollowing: boolean;
  isConnected: boolean;
  authorName: string;
  authorUsername: string;
  authorProfilePic: string;
  authorRole: string;
}
