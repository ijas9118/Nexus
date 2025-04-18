import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { MentorFormData } from "@/types/mentor";

const MentorService = {
  applyAsMentor: (formData: MentorFormData) => {
    handleApi(() => api.post("/mentor/apply", formData));
  },
  getStatus: () => handleApi(() => api.get("/mentor/get-status")),
  getAllMentors: () => handleApi(() => api.get("/mentor/all")),
};

export default MentorService;
