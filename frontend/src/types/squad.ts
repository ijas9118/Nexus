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
  adminName: string;
  adminUsername: string;
  adminProfilePic: string;
}
