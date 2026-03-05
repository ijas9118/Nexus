export interface FollowStats {
  connectionsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface ConnectionStatus {
  result: boolean;
}

export interface PendingRequest {
  _id: string;
  requesterId: {
    _id: string;
    name: string;
    username: string;
    profilePic?: string;
  };
  recipientId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
