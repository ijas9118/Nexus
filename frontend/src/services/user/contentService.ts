import axios, { AxiosError } from "axios";
import api from "../api";

export const uploadFiles = async (
  uploadUrl: string,
  formData: FormData,
): Promise<string | undefined> => {
  try {
    const response = await axios.post(uploadUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.secure_url;
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

export const addContent = async (requestData: {
  contentType: string;
  squad: string;
  title: string;
  content: string;
  isPremium: boolean;
  thumbnailUrl: string | null | undefined;
  videoUrl: string | null | undefined;
}): Promise<any> => {
  try {
    const response = await api.post("/content/posts", requestData);
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

export const getAllContent = async ({ pageParam = 1 }) => {
  try {
    const response = await api.get(`/content/posts?page=${pageParam}&limit=4`);
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

export const getContent = async (id: string) => {
  try {
    const response = await api.get(`/content/posts/${id}`);
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

export const getFollowingUsersContents = async () => {
  try {
    const response = await api.get("/content/posts/following");
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

export const getHistory = async () => {
  try {
    const response = await api.get("/content/history/");
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

export const removeFromHistory = async (contentId: string) => {
  try {
    const response = await api.post("/content/history/remove", { contentId });
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
