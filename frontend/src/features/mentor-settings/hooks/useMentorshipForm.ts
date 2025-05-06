import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import MentorshipTypeService from "@/services/mentorshipTypeService";
import TargetAudienceService from "@/services/targetAudienceService";
import MentorService from "@/services/mentorService";

const mentorshipFormSchema = z.object({
  mentorshipTypes: z.array(z.string()).min(1, {
    message: "Please select at least one mentorship type.",
  }),
  targetAudiences: z.array(z.string()).min(1, {
    message: "Please select at least one target audience.",
  }),
});

type MentorshipFormValues = z.infer<typeof mentorshipFormSchema>;

interface UseMentorshipFormProps {
  mentorData: {
    mentorshipDetails?: {
      mentorshipTypes?: Array<{ _id: string }>;
      targetAudiences?: Array<{ _id: string }>;
    };
  };
}

export const useMentorshipForm = ({ mentorData }: UseMentorshipFormProps) => {
  const queryClient = useQueryClient();

  // Fetch mentorship types
  const { data: mentorshipTypes = [], isLoading: isLoadingTypes } = useQuery({
    queryKey: ["mentorshipTypes"],
    queryFn: () => MentorshipTypeService.getAllTypes(),
  });

  // Fetch target audiences
  const { data: targetAudiences = [], isLoading: isLoadingAudiences } =
    useQuery({
      queryKey: ["targetAudience"],
      queryFn: () => TargetAudienceService.getAll(),
    });

  // Set up form
  const form = useForm<MentorshipFormValues>({
    resolver: zodResolver(mentorshipFormSchema),
    defaultValues: {
      mentorshipTypes:
        mentorData?.mentorshipDetails?.mentorshipTypes?.map(
          (type) => type._id,
        ) || [],
      targetAudiences:
        mentorData?.mentorshipDetails?.targetAudiences?.map(
          (type) => type._id,
        ) || [],
    },
  });

  // Set up mutation
  const mutation = useMutation({
    mutationFn: async (data: MentorshipFormValues) => {
      // Format data for API
      const formattedData = {
        mentorshipTypes: data.mentorshipTypes,
        targetAudiences: data.targetAudiences,
      };
      return await MentorService.updateMentorshipDetails(formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorDetails"] });
      toast.success("Mentorship details updated", {
        description:
          "Your mentorship preferences have been updated successfully.",
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description:
          "There was an error updating your mentorship details. Please try again.",
      });
    },
  });

  // Map options for MultiSelect
  const mentorshipTypeOptions = mentorshipTypes.map((type: any) => ({
    value: type._id,
    label: type.name,
  }));

  const targetAudienceOptions = targetAudiences.map((audience: any) => ({
    value: audience._id,
    label: audience.name,
  }));

  return {
    form,
    mentorshipTypeOptions,
    targetAudienceOptions,
    isLoading: isLoadingTypes || isLoadingAudiences,
    mutation,
    handleSubmit: form.handleSubmit((values) => mutation.mutate(values)),
  };
};
