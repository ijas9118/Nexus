import { AxiosError } from "axios";
import api from "./api";
import { IPlan } from "@/types/plans";

const PlanService = {
  createPlan: async (planData: IPlan) => {
    try {
      const response = await api.post("plans/", planData);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw error.response?.data || error.message;
      } else if (error instanceof Error) {
        throw error.message;
      } else {
        throw "An unknown error occurred";
      }
    }
  },

  getAllPlans: async () => {
    try {
      const response = await api.get("plans/");
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw error.response?.data || error.message;
      } else if (error instanceof Error) {
        throw error.message;
      } else {
        throw "An unknown error occurred";
      }
    }
  },
};

export default PlanService;
