import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { Mentor, MentorFormData, MentorshipType } from "@/types/mentor";

const MentorService = {
  applyAsMentor: (formData: MentorFormData) =>
    handleApi(() => api.post("/mentor/apply", formData)),

  getStatus: () => handleApi(() => api.get("/mentor/get-status")),

  getAllMentors: () => handleApi(() => api.get<Mentor[]>("/mentor/admin/all")),

  getApprovedMentors: () => handleApi(() => api.get<Mentor[]>("/mentor/all")),

  getMentorDetails: (mentorId: string) =>
    handleApi(() => api.get<Mentor>(`/mentor/get-mentor-details/${mentorId}`)),

  approveMentor: (mentorId: string, userId: string) =>
    handleApi(() => api.patch(`/mentor/approve/${mentorId}/${userId}`)),

  rejectMentor: (mentorId: string) =>
    handleApi(() => api.patch(`/mentor/reject/${mentorId}`)),

  getMentorEnums: () =>
    handleApi(() =>
      api.get<{
        experienceLevels: string[];
        expertiseAreas: string[];
        technologies: string[];
        mentorshipTypes: string[];
        targetAudiences: string[];
      }>("/mentor/enums"),
    ),

  getMentorshipTypes: (mentorId: string) =>
    handleApi(() =>
      api.get<MentorshipType[]>(`/mentor/${mentorId}/mentorship-types`),
    ),

  updateMentorExperience: (data: {
    currentRole: string;
    company: string;
    experienceLevel: string;
    expertiseAreas: string[];
    technologies: string[];
    bio: string;
    resume?: string;
  }) => handleApi(() => api.put("/mentor/experience", data)),

  updateMentorshipDetails: (data: {
    mentorshipTypes: string[];
    targetAudiences: string[];
  }) => handleApi(() => api.put("/mentor/mentorship-details", data)),

  getMentorDashboard: () => handleApi(() => api.get<any>("/mentor/dashboard")),
};

export default MentorService;
