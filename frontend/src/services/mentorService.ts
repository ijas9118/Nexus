import { Mentor, MentorFormData, MentorshipType } from "@/types/mentor";
import { ADMIN_ROUTES } from "@/utils/constants";
import { handleApi } from "@/utils/handleApi";
import api from "./api";
const MENTOR_ROUTE = "/mentor";

const MentorService = {
  applyAsMentor: (formData: MentorFormData) =>
    handleApi(() => api.post(`${MENTOR_ROUTE}/apply`, formData)),

  getStatus: () => handleApi(() => api.get(`${MENTOR_ROUTE}/get-status`)),

  getAllMentors: () =>
    handleApi(() => api.get<Mentor[]>(`${MENTOR_ROUTE}/admin/all`)),

  getApprovedMentors: () =>
    handleApi(() => api.get<Mentor[]>(`${MENTOR_ROUTE}/all`)),

  getMentorDetails: (mentorId: string) =>
    handleApi(() =>
      api.get<Mentor>(`${MENTOR_ROUTE}/get-mentor-details/${mentorId}`),
    ),

  approveMentor: (mentorId: string, userId: string) =>
    handleApi(() => api.patch(`${MENTOR_ROUTE}/approve/${mentorId}/${userId}`)),

  rejectMentor: (mentorId: string) =>
    handleApi(() => api.patch(`${MENTOR_ROUTE}/reject/${mentorId}`)),

  getMentorEnums: () =>
    handleApi(() =>
      api.get<{
        experienceLevels: string[];
        expertiseAreas: string[];
        technologies: string[];
        mentorshipTypes: string[];
        targetAudiences: string[];
      }>(`${MENTOR_ROUTE}/enums`),
    ),

  getMentorshipTypes: (mentorId: string) =>
    handleApi(() =>
      api.get<MentorshipType[]>(`${MENTOR_ROUTE}/${mentorId}/mentorship-types`),
    ),

  updateMentorExperience: (data: {
    currentRole: string;
    company: string;
    experienceLevel: string;
    expertiseAreas: string[];
    technologies: string[];
    bio: string;
    resume?: string;
  }) => handleApi(() => api.put(`${MENTOR_ROUTE}/experience`, data)),

  updateMentorshipDetails: (data: {
    mentorshipTypes: string[];
    targetAudiences: string[];
  }) => handleApi(() => api.put(`${MENTOR_ROUTE}/mentorship-details`, data)),

  getMentorDashboard: () =>
    handleApi(() => api.get<any>(ADMIN_ROUTES.DASHBOARD)),
};

export default MentorService;
