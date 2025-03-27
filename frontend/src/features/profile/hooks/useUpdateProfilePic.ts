import api from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateProfilePic() {
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("profilePic", file);

      const response = await api.put("user/update/profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile picture updated!");
    },
    onError: (error) => {
      toast.error("Failed to update profile picture.");
      console.error(error);
    },
  });

  return {
    updateProfilePic: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
