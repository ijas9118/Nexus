import { inject, injectable } from "inversify";

import type { ISubscriptionRepository } from "@/core/interfaces/repositories/i-subscription-repository";
import type { ISubscriptionService } from "@/core/interfaces/services/i-subscription-service";
import type { ISubscription } from "@/models/subscription/subscription.model";

import { TYPES } from "@/di/types";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionRepository) private _subscriptionRepo: ISubscriptionRepository,
  ) {}

  async getUserSubscription(userId: string): Promise<ISubscription | null> {
    return this._subscriptionRepo.getUserCurrentSubscription(userId);
  }
}
