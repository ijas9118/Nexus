import { AxiosError } from "axios";
import api from "./api";
import { IPlan } from "@/types/plans";

const PaymentService = {
  createSession: async (plan: IPlan) => {
    try {
      let priceId = null;
      if (plan.interval === "yearly") {
        priceId = import.meta.env.VITE_PRICE_YEARLY;
      } else {
        priceId = import.meta.env.VITE_PRICE_MONTHLY;
      }

      const response = await api.post("payment/create-checkout-session", {
        plan,
        priceId: priceId,
      });
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

export default PaymentService;
