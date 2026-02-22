import { ISubscriptionWithPlan } from "@/types/subscription";
import api from "./api";
import { handleApi } from "@/utils/handleApi";
import { SUBSCRIPTION_ROUTES } from "@/utils/constants";

const SubscriptionService = {
  getCurrentSubscription: () =>
    handleApi(() =>
      api.get<ISubscriptionWithPlan>(SUBSCRIPTION_ROUTES.CURRENT),
    ),
};

export default SubscriptionService;
