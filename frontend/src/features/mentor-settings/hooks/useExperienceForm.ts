import MentorMetadataService from "@/services/mentorMetadataService";
import MentorService from "@/services/mentorService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const experienceFormSchema = z.object({
  currentRole: z.string().min(2, {
    message: "Current role must be at least 2 characters.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  experienceLevel: z.string({
    required_error: "Please select an experience level.",
  }),
  expertiseAreas: z.array(z.string()).min(1, {
    message: "Please select at least one expertise area.",
  }),
  technologies: z.array(z.string()).min(1, {
    message: "Please select at least one technology.",
  }),
  bio: z
    .string()
    .min(50, {
      message: "Bio must be at least 50 characters.",
    })
    .max(500, {
      message: "Bio must not exceed 500 characters.",
    }),
  resume: z.string().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

// Custom Hook
export const useExperienceForm = (experience: any) => {
  const queryClient = useQueryClient();

  // Fetch metadata
  const { data: experienceLevels = [] } = useQuery({
    queryKey: ["metadata", "experienceLevel"],
    queryFn: () => MentorMetadataService.getByType("experienceLevel"),
  });

  const { data: expertiseAreas = [] } = useQuery({
    queryKey: ["metadata", "expertiseArea"],
    queryFn: () => MentorMetadataService.getByType("expertiseArea"),
  });

  const { data: technologies = [] } = useQuery({
    queryKey: ["metadata", "technology"],
    queryFn: () => MentorMetadataService.getByType("technology"),
  });

  // Set up form
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      currentRole: "",
      company: "",
      experienceLevel: "",
      expertiseAreas: [],
      technologies: [],
      bio: "",
      resume: "",
    },
  });

  // Reset form when experience changes
  useEffect(() => {
    if (experience) {
      form.reset({
        currentRole: experience.currentRole || "",
        company: experience.company || "",
        experienceLevel: experience.experienceLevel?._id || "",
        expertiseAreas:
          experience.expertiseAreas?.map((area: any) => area._id) || [],
        technologies:
          experience.technologies?.map((tech: any) => tech._id) || [],
        bio: experience.bio || "",
        resume: experience.resume || "",
      });
    }
  }, [experience, form]);

  // Set up mutation
  const mutation = useMutation({
    mutationFn: MentorService.updateMentorExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorDetails"] });
      toast.success("Experience updated", {
        description:
          "Your professional experience has been updated successfully.",
      });
    },
    onError: () => {
      toast.error("Error", {
        description:
          "There was an error updating your experience. Please try again.",
      });
    },
  });

  return {
    form,
    experienceLevels,
    expertiseAreas,
    technologies,
    mutation,
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
  };
};
