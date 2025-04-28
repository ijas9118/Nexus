import api from "./api";
import { IPlan } from "@/types/plans";
import { handleApi } from "@/utils/handleApi";

const PaymentService = {
  createSession: (plan: IPlan, email: string) =>
    handleApi<string>(() =>
      api.post("payment/create-checkout-session", {
        planId: plan._id,
        tier: plan.tier,
        price: plan.price,
        email,
      }),
    ),
};

export default PaymentService;
