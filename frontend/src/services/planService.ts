import { IPlan } from "@/types/plans";
import api from "./api";
import { handleApi } from "@/utils/handleApi";

const PlanService = {
  createPlan: (planData: IPlan) =>
    handleApi(() => api.post("/plans", planData)),

  getAllPlans: async () => handleApi(() => api.get<IPlan[]>("/plans")),

  getPlanById: async (id: string) => handleApi(() => api.get(`/plans/${id}`)),

  updatePlan: async (id: string, planData: Partial<IPlan>) =>
    handleApi(() => api.put(`plans/${id}`, planData)),

  deletePlan: async (id: string) => handleApi(() => api.delete(`/plans/${id}`)),
};

export default PlanService;
