import FollowService from "@/services/followService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followedId: string) => FollowService.followUser(followedId),
    onSuccess: () => {
      toast.success("Followed user");
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followedId: string) => FollowService.unfollowUser(followedId),
    onSuccess: () => {
      toast.success("Unfollowed user");
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
};

export const useConnectUser = () => {
  return useMutation({
    mutationFn: (recipientId: string) =>
      FollowService.sendConnectionRequest(recipientId),
    onSuccess: (data) => {
      toast.success(data.message || "Connection request sent");
    },
    onError: (error: any) => {
      if (typeof error === "string") {
        toast.error(error);
      } else if (typeof error === "object" && error !== null) {
        if ("statusCode" in error && error.statusCode === 409) {
          toast.error("Connection request already sent");
        } else {
          toast.error(error.message || "Failed to send connection request");
        }
      } else {
        toast.error("Something went wrong");
      }
    },
  });
};
