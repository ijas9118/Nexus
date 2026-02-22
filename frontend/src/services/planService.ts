import { IPlan } from "@/types/plans";
import api from "./api";
import { handleApi } from "@/utils/handleApi";
import { PLAN_ROUTES } from "@/utils/constants";

const PlanService = {
  createPlan: (planData: any) =>
    handleApi(() => api.post(PLAN_ROUTES.BASE, planData)),

  getAllPlans: async (): Promise<IPlan[]> => {
    const response = await handleApi(() => api.get(PLAN_ROUTES.BASE));
    // The API returns {data: IPlan[]} but handleApi already unwraps response.data
    // So we need to check if the response itself contains a data property
    const typedResponse = response as IPlan[] | { data: IPlan[] };
    return Array.isArray(typedResponse)
      ? typedResponse
      : typedResponse?.data || [];
  },

  getPlanById: async (id: string) =>
    handleApi(() => api.get(`${PLAN_ROUTES.BASE}/${id}`)),

  updatePlan: async (id: string, planData: Partial<IPlan>) =>
    handleApi(() => api.put(`${PLAN_ROUTES.BASE}/${id}`, planData)),

  deletePlan: async (id: string) =>
    handleApi(() => api.delete(`${PLAN_ROUTES.BASE}/${id}`)),
};

export default PlanService;
