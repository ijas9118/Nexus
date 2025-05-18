import ContentService from "@/services/user/contentService";
import { FormValues } from "../components/BlogCreationForm";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useAddPost() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const formData = new FormData();
      formData.append("contentType", data.contentType);
      formData.append("squad", data.squad);
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("isPremium", String(data.isPremium));

      // Append files if provided
      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }
      if (data.videoFile && data.videoFile[0]) {
        formData.append("videoFile", data.videoFile[0]);
      }

      return await ContentService.addContent(formData);
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
