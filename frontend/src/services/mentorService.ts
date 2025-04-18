import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { MentorApplication, MentorFormData } from "@/types/mentor";

const MentorService = {
  applyAsMentor: (formData: MentorFormData) => {
    handleApi(() => api.post("/mentor/apply", formData));
  },

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
};

export default MentorService;
