import axios from "axios";
import api from "./api";

export const likeContent = async (contentId: string) => {
  try {
    const response = await api.post(`/content/${contentId}/like`);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred during liking.";
    throw new Error(errorMessage);
  }
};

export const uploadFiles = async (
  uploadUrl: string,
  formData: FormData
): Promise<string | undefined> => {
  try {
    const response = await axios.post(uploadUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.secure_url;
  } catch (error) {
    console.error("File upload failed:", error);
    throw new Error("Failed to upload file to Cloudinary");
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
  } catch (error: any) {
    console.error("Failed to add content:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while adding the content"
    );
  }
};

export const getAllContent = async () => {
  try {
    const response = await api.get("/content/posts");
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "An unexpected error occurred during fetching contents.";
    throw new Error(errorMessage);
  }
};
