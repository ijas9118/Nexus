import { IPlan } from "@/types/plans";
import api from "./api";
import { handleApi } from "@/utils/handleApi";

const PlanService = {
  createPlan: (planData: any) => handleApi(() => api.post("/plans", planData)),

  getAllPlans: async (): Promise<IPlan[]> => {
    const response = await handleApi(() => api.get("/plans"));
    // The API returns {data: IPlan[]} but handleApi already unwraps response.data
    // So we need to check if the response itself contains a data property
    const typedResponse = response as IPlan[] | { data: IPlan[] };
    return Array.isArray(typedResponse) ? typedResponse : (typedResponse?.data || []);
  },

  getPlanById: async (id: string) => handleApi(() => api.get(`/plans/${id}`)),

  updatePlan: async (id: string, planData: Partial<IPlan>) =>
    handleApi(() => api.put(`plans/${id}`, planData)),

  deletePlan: async (id: string) => handleApi(() => api.delete(`/plans/${id}`)),
};

export default PlanService;
