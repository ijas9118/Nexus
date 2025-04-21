import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { MentorApplication, MentorFormData } from "@/types/mentor";

const MentorService = {
  applyAsMentor: (formData: MentorFormData) =>
    handleApi(() => api.post("/mentor/apply", formData)),

  getStatus: () => handleApi(() => api.get("/mentor/get-status")),

  getAllMentors: () => handleApi(() => api.get("/mentor/all")),

  getMentorDetails: (mentorId: string) =>
    handleApi(() =>
      api.get<MentorApplication>(`/mentor/get-mentor-details/${mentorId}`),
    ),

  approveMentor: (mentorId: string, userId: string) =>
    handleApi(() => api.patch(`/mentor/approve/${mentorId}/${userId}`)),

  rejectMentor: (mentorId: string) =>
    handleApi(() => api.patch(`/mentor/reject/${mentorId}`)),

  getMentorEnums: () =>
    handleApi(() =>
      api.get<{
        experienceLevels: string[];
        expertiseAreas: { _id: string; value: string }[];
        technologies: { _id: string; value: string }[];
        mentorshipTypes: { _id: string; value: string }[];
        targetAudiences: { _id: string; value: string }[];
      }>("/mentor/enums"),
    ),
};

export default MentorService;
