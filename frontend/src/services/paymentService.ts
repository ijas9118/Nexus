import api from "./api";
import { IPlan } from "@/types/plans";
import { handleApi } from "@/utils/handleApi";
import { PAYMENT_ROUTES } from "@/utils/constants";

const PaymentService = {
  createSession: (plan: IPlan, email: string) =>
    handleApi<string>(() =>
      api.post(PAYMENT_ROUTES.CREATE_CHECKOUT_SESSION, {
        planId: plan._id,
        tier: plan.tier,
        price: plan.price,
        email,
      }),
    ),

  verifySession: (sessionId: string) =>
    handleApi(() =>
      api.get<{ success: boolean }>(
        `${PAYMENT_ROUTES.VERIFY_SESSION}/${sessionId}`,
      ),
    ),
};

export default PaymentService;
