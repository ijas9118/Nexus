import api from "./api";
import { handleApi } from "@/utils/handleApi";

const FollowService = {
  followUser: (followedId: string) =>
    handleApi(() => api.post<any>("/followers/follow", { followedId })),

  checkIsFollowing: (followerId: string, followedId: string) =>
    handleApi(() =>
      api.post<any>("/followers/is-following", { followerId, followedId }),
    ),

  unfollowUser: (followedId: string) =>
    handleApi(() => api.post<any>("/followers/unfollow", { followedId })),

  sendConnectionRequest: (recipientId: string) =>
    handleApi(() => api.post<any>("/followers/connect", { recipientId })),

  withdrawConnectionRequest: (recipientId: string) =>
    handleApi(() => api.post<any>("/followers/withdraw", { recipientId })),

  acceptConnectionRequest: (requesterId: string) =>
    handleApi(() => api.post<any>("/followers/accept", { requesterId })),

  hasSentConnectionRequest: (recipientId: string) =>
    handleApi(() => api.post<any>("/followers/has-requested", { recipientId })),

  checkConnected: (userId2: string) =>
    handleApi(() => api.post<any>("/followers/is-connected", { userId2 })),

  searchConnectedUsers: (searchTerm?: string) =>
    handleApi(() =>
      api.get<any>("/followers/connections", {
        params: { search: searchTerm },
      }),
    ),

  getPendingRequests: () => handleApi(() => api.get<any>("/followers/pending")),

  getAllConnections: () =>
    handleApi(() => api.get<any>("/followers/get-all-connections")),

  getFollowStats: (userId: string) =>
    handleApi(() => api.get<any>(`/followers/stats/${userId}`)),

  getFollowers: (userId: string) =>
    handleApi(() => api.get<any>(`/followers/${userId}/followers`)),

  getFollowings: (userId: string) =>
    handleApi(() => api.get<any>(`/followers/${userId}/following`)),

  getConnections: (userId: string) =>
    handleApi(() => api.get<any>(`/followers/${userId}/connections`)),
};

export default FollowService;
