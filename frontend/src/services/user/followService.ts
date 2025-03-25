import { AxiosError } from "axios";
import api from "../api";

export const followUser = async (followedId: string) => {
  try {
    const response = await api.post("/followers/follow", { followedId });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log(error);
      throw error.response?.data || error.message;
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred";
    }
  }
};

export const checkIsFollowing = async (
  followerId: string,
  followedId: string,
) => {
  try {
    const response = await api.post("/followers/is-following", {
      followerId,
      followedId,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log(error);
      throw error.response?.data || error.message;
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred";
    }
  }
};

export const unfollowUser = async (followedId: string) => {
  try {
    const response = await api.post("/followers/unfollow", { followedId });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log(error);
      throw error.response?.data || error.message;
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred";
    }
  }
};

export const sendConnectionRequest = async (recipientId: string) => {
  try {
    const response = await api.post("/followers/connect", { recipientId });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log(error);
      throw error.response?.data || error.message;
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred";
    }
  }
};

export const withdrawConnectionRequest = async (recipientId: string) => {
  try {
    const response = await api.post("/followers/withdraw", { recipientId });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log(error);
      throw error.response?.data || error.message;
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred";
    }
  }
};

export const acceptConnectionRequest = async (requesterId: string) => {
  try {
    const response = await api.post("/followers/accept", { requesterId });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log(error);
      throw error.response?.data || error.message;
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred";
    }
  }
};

export const hasSentConnectionRequest = async (recipientId: string) => {
  try {
    const response = await api.post("/followers/has-requested", {
      recipientId,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log(error);
      throw error.response?.data || error.message;
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred";
    }
  }
};

export const checkConnected = async (userId2: string) => {
  try {
    const response = await api.post("/followers/is-connected", { userId2 });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log(error);
      throw error.response?.data || error.message;
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred";
    }
  }
};

export const searchConnectedUsers = async (searchTerm?: string) => {
  try {
    const response = await api.get("/followers/connections", {
      params: {
        search: searchTerm,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error.message;
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred";
    }
  }
};

export const getPendingRequests = async () => {
  try {
    const response = await api.get("/followers/pending");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error.message;
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred";
    }
  }
};
