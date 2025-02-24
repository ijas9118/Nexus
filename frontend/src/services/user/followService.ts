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

unfollowUser;
