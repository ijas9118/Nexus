import api from "../api";

export const followUser = async (followedId: string) => {
  try {
    const response = await api.post("/followers/follow", { followedId });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred during following.";
    throw new Error(errorMessage);
  }
};

export const checkIsFollowing = async (followerId: string, followedId: string) => {
  try {
    const response = await api.post("/followers/is-following", {
      followerId,
      followedId,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred during checking.";
    throw new Error(errorMessage);
  }
};

export const unfollowUser = async (followedId: string) => {
  try {
    const response = await api.post("/followers/unfollow", { followedId });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred during unfollowing.";
    throw new Error(errorMessage);
  }
};

export const sendConnectionRequest = async (recipientId: string) => {
  try {
    const response = await api.post("/followers/connect", { recipientId });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "An unexpected error occurred while sending request.";
    throw new Error(errorMessage);
  }
};

export const acceptConnectionRequest = async (recipientId: string) => {
  try {
    const response = await api.post("/followers/accept", { recipientId });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "An unexpected error occurred while accepting request.";
    throw new Error(errorMessage);
  }
};

export const hasSentConnectionRequest = async (recipientId: string) => {
  try {
    const response = await api.post("/followers/has-requested", { recipientId });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "An unexpected error occurred while checking request.";
    throw new Error(errorMessage);
  }
};
