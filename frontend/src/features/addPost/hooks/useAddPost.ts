import ContentService, { uploadFiles } from "@/services/user/contentService";
import { FormValues } from "../components/BlogCreationForm";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useAddPost() {
  const navigate = useNavigate();

  const uploadToCloudinary = async (data: FormValues) => {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUD_NAME
    }/upload`;
    const imagePreset = "nexus_images";
    const videoPreset = "nexus_videos";

    const uploadFile = async (file: File, preset: string) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset);

      const response = await uploadFiles(uploadUrl, formData);
      return response;
    };

    try {
      const thumbnailUrl =
        data.thumbnail && data.thumbnail[0]
          ? await uploadFile(data.thumbnail[0], imagePreset)
          : null;

      const videoUrl =
        data.contentType === "video" && data.videoFile?.[0]
          ? await uploadFile(data.videoFile[0], videoPreset)
          : null;

      return { thumbnailUrl, videoUrl };
    } catch (error) {
      console.error("Cloudinary upload failed", error);
      throw new Error("Failed to upload files to Cloudinary");
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const uploadedFiles = await uploadToCloudinary(data);

      const requestData = {
        contentType: data.contentType,
        squad: data.squad,
        title: data.title,
        content: data.content,
        isPremium: data.isPremium,
        thumbnailUrl: uploadedFiles.thumbnailUrl,
        videoUrl: uploadedFiles.videoUrl,
      };

      return await ContentService.addContent(requestData);
    },
    onSuccess: (result) => {
      toast.success("Wohoo!", {
        description: result.message,
      });
      navigate("/myFeed");
    },
    onError: (error) => {
      console.error("Error submitting form", error);
      toast.error(
        "An error occurred while submitting the form. Please try again.",
      );
    },
  });

  return {
    submitPost: mutation.mutate,
    isSubmitting: mutation.isPending,
  };
}
