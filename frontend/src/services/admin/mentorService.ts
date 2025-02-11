import api from "../api";

const MentorService = {
  sendInvite: async (data: { email: string; name: string; specialization: string }) => {
    try {
      const response = await api.post("admin/mentor/invite", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  acceptInvite: async (token: string) => {
    try {
      console.log(token);
      const response = await api.post("admin/mentor/acceptInvite", { token });
      console.log(response);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getAllMentors: async () => {
    try {
      const response = await api.get("/mentor");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};

export default MentorService;
