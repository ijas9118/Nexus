import type { IPlan } from "@/types/plans";
import { PAYMENT_ROUTES } from "@/utils/constants";
import { handleApi } from "@/utils/handleApi";

import api from "./api";

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
