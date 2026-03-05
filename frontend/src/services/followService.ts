import api from "./api";
import { handleApi } from "@/utils/handleApi";
import { FOLLOWER_ROUTES } from "@/utils/constants";
import { ConnectionStatus, FollowStats, PendingRequest } from "@/types/follow";
import { UserInterface } from "@/types/user";

const FollowService = {
  followUser: (followedId: string) =>
    handleApi(() => api.post<void>(FOLLOWER_ROUTES.FOLLOW, { followedId })),

  checkIsFollowing: (followerId: string, followedId: string) =>
    handleApi(() =>
      api.post<boolean>(FOLLOWER_ROUTES.IS_FOLLOWING, {
        followerId,
        followedId,
      }),
    ),

  unfollowUser: (followedId: string) =>
    handleApi(() => api.post<void>(FOLLOWER_ROUTES.UNFOLLOW, { followedId })),

  sendConnectionRequest: (recipientId: string) =>
    handleApi(() => api.post<void>(FOLLOWER_ROUTES.CONNECT, { recipientId })),

  withdrawConnectionRequest: (recipientId: string) =>
    handleApi(() => api.post<void>(FOLLOWER_ROUTES.WITHDRAW, { recipientId })),

  acceptConnectionRequest: (requesterId: string) =>
    handleApi(() => api.post<void>(FOLLOWER_ROUTES.ACCEPT, { requesterId })),

  rejectConnectionRequest: (requesterId: string) =>
    handleApi(() => api.post<void>(FOLLOWER_ROUTES.REJECT, { requesterId })),

  removeConnection: (connectionId: string) =>
    handleApi(() => api.post<void>(FOLLOWER_ROUTES.REMOVE, { connectionId })),

  hasSentConnectionRequest: (recipientId: string) =>
    handleApi(() =>
      api.post<ConnectionStatus>(FOLLOWER_ROUTES.HAS_REQUESTED, {
        recipientId,
      }),
    ),

  checkConnected: (userId2: string) =>
    handleApi(() =>
      api.post<ConnectionStatus>(FOLLOWER_ROUTES.IS_CONNECTED, { userId2 }),
    ),

  searchConnectedUsers: (searchTerm?: string) =>
    handleApi(() =>
      api.get<UserInterface[]>(FOLLOWER_ROUTES.CONNECTIONS, {
        params: { search: searchTerm },
      }),
    ),

  getPendingRequests: () =>
    handleApi(() => api.get<PendingRequest[]>(FOLLOWER_ROUTES.PENDING)),

  getAllConnections: () =>
    handleApi(() =>
      api.get<UserInterface[]>(FOLLOWER_ROUTES.GET_ALL_CONNECTIONS),
    ),

  getFollowStats: (userId: string) =>
    handleApi(() => api.get<FollowStats>(`${FOLLOWER_ROUTES.STATS}/${userId}`)),

  getFollowers: (userId: string) =>
    handleApi(() =>
      api.get<UserInterface[]>(`${FOLLOWER_ROUTES.BASE}/${userId}/followers`),
    ),

  getFollowings: (userId: string) =>
    handleApi(() =>
      api.get<UserInterface[]>(`${FOLLOWER_ROUTES.BASE}/${userId}/following`),
    ),

  getConnections: (userId: string) =>
    handleApi(() =>
      api.get<UserInterface[]>(`${FOLLOWER_ROUTES.BASE}/${userId}/connections`),
    ),

  getSentConnectionRequests: () =>
    handleApi(() => api.get<UserInterface[]>(FOLLOWER_ROUTES.SENT_REQUESTS)),
};

export default FollowService;
