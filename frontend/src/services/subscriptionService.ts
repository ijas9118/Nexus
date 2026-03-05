import type { ISubscriptionWithPlan } from "@/types/subscription";
import { SUBSCRIPTION_ROUTES } from "@/utils/constants";
import { handleApi } from "@/utils/handleApi";

import api from "./api";

const SubscriptionService = {
  getCurrentSubscription: () =>
    handleApi(() =>
      api.get<ISubscriptionWithPlan>(SUBSCRIPTION_ROUTES.CURRENT),
    ),
};

export default SubscriptionService;
