import type { CreateSubscriptionDTO } from "@/dtos/requests/subscription.dto";
import type { ISubscription } from "@/models/subscription/subscription.model";

export interface ISubscriptionService {
  getUserSubscription: (userId: string) => Promise<ISubscription | null>;
  createSubscription: (data: CreateSubscriptionDTO) => Promise<ISubscription>;
  cancelSubscription: (userId: string) => Promise<ISubscription>;
  upgradeSubscription: (userId: string, newPlanId: string) => Promise<ISubscription>;
  downgradeSubscription: (userId: string, newPlanId: string) => Promise<ISubscription>;
  getUserActiveSubscription: (userId: string) => Promise<ISubscription | null>;
  expireSubscription: (subscriptionId: string) => Promise<void>;
}
