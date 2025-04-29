import { ISubscriptionWithPlan } from "@/types/subscription";
import api from "./api";
import { handleApi } from "@/utils/handleApi";

const SubscriptionService = {
  getCurrentSubscription: () =>
    handleApi(() => api.get<ISubscriptionWithPlan>("/subscription/current")),
};

export default SubscriptionService;
