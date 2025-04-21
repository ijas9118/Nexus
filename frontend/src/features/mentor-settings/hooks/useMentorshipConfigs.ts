import { MentorConfigService } from "@/services/mentorConfigService";
import { useQuery } from "@tanstack/react-query";

export function useExperienceLevels() {
  return useQuery({
    queryKey: ["mentorship-config", "experience-level"],
    queryFn: () => MentorConfigService.getConfigsByCategory("experienceLevel"),
  });
}

export function useExpertiseAreas() {
  return useQuery({
    queryKey: ["mentorship-config", "expertise-area"],
    queryFn: () => MentorConfigService.getConfigsByCategory("expertiseArea"),
  });
}

export function useTechnologies() {
  return useQuery({
    queryKey: ["mentorship-config", "technology"],
    queryFn: () => MentorConfigService.getConfigsByCategory("technology"),
  });
}

export function useMentorshipTypes() {
  return useQuery({
    queryKey: ["mentorship-config", "mentorshipType"],
    queryFn: () => MentorConfigService.getConfigsByCategory("mentorshipType"),
  });
}

export function useTargetAudience() {
  return useQuery({
    queryKey: ["mentorship-config", "targetAudience"],
    queryFn: () => MentorConfigService.getConfigsByCategory("targetAudience"),
  });
}
