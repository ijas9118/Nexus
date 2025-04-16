import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MentorConfigService } from "@/services/mentorConfigService";
import { MentorshipConfig } from "@/types/mentor";

export const useMentorshipConfigs = () => {
  const queryClient = useQueryClient();

  // Fetch all configs
  const {
    data: configs = [],
    isLoading,
    error,
    isError,
  } = useQuery<MentorshipConfig[], Error>({
    queryKey: ["mentorshipConfigs"],
    queryFn: async () => {
      const response = await MentorConfigService.getAllConfigs();
      return response;
    },
  });

  // Show toast notification if there's an error
  if (isError) {
    toast.error("Error", {
      description: error?.message || "Failed to fetch configurations",
    });
  }

  // Create config mutation
  const createMutation = useMutation({
    mutationFn: (config: MentorshipConfig) =>
      MentorConfigService.createConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorshipConfigs"] });
      toast.success("Success", {
        description: "Configuration created successfully",
      });
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error?.message || "Failed to create configuration",
      });
    },
  });

  // Update config mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      config,
    }: {
      id: string;
      config: Partial<MentorshipConfig>;
    }) => MentorConfigService.updateConfig(id, config),
    onMutate: async ({ id, config }) => {
      await queryClient.cancelQueries({ queryKey: ["mentorshipConfigs"] });
      const previousConfigs = queryClient.getQueryData<MentorshipConfig[]>([
        "mentorshipConfigs",
      ]);
      queryClient.setQueryData<MentorshipConfig[]>(
        ["mentorshipConfigs"],
        (old) => old?.map((c) => (c._id === id ? { ...c, ...config } : c)),
      );
      return { previousConfigs };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["mentorshipConfigs"], context?.previousConfigs);
      toast.error("Error", {
        description: "Failed to update configuration",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorshipConfigs"] });
    },
  });

  // Delete config mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => MentorConfigService.deleteConfig(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["mentorshipConfigs"] });
      const previousConfigs = queryClient.getQueryData<MentorshipConfig[]>([
        "mentorshipConfigs",
      ]);
      queryClient.setQueryData<MentorshipConfig[]>(
        ["mentorshipConfigs"],
        (old) => old?.filter((c) => c._id !== id),
      );
      return { previousConfigs };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["mentorshipConfigs"], context?.previousConfigs);
      toast.error("Error", {
        description: "Failed to delete configuration",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorshipConfigs"] });
    },
  });

  return {
    configs,
    isLoading,
    handleCreateConfig: (config: MentorshipConfig) =>
      createMutation.mutate(config),
    handleUpdateConfig: (id: string, config: Partial<MentorshipConfig>) =>
      updateMutation.mutate({ id, config }),
    handleDeleteConfig: (id: string) => deleteMutation.mutate(id),
  };
};
