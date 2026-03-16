import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IPlanRepository } from "@/core/interfaces/repositories/i-plan-repository";
import type { ISubscriptionRepository } from "@/core/interfaces/repositories/i-subscription-repository";
import type { IUserRepository } from "@/core/interfaces/repositories/i-user-repository";
import type { ISubscriptionService } from "@/core/interfaces/services/i-subscription-service";
import type { CreateSubscriptionDTO } from "@/dtos/requests/subscription.dto";
import type { ISubscription } from "@/models/subscription/subscription.model";

import { stripe } from "@/config/stripe.cofig";
import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { PAYMENT_MESSAGES } = MESSAGES;

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionRepository) private _subscriptionRepo: ISubscriptionRepository,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.PlanRepository) private _planRepo: IPlanRepository,
  ) {}

  async getUserSubscription(userId: string): Promise<ISubscription | null> {
    return this._subscriptionRepo.getUserCurrentSubscription(userId);
  }

  async getUserActiveSubscription(userId: string): Promise<ISubscription | null> {
    return this._subscriptionRepo.findOne({ userId, status: "active" });
  }

  async createSubscription(data: CreateSubscriptionDTO): Promise<ISubscription> {
    const plan = await this._planRepo.findById(data.planId);
    if (!plan) {
      throw new CustomError(PAYMENT_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const subscription = await this._subscriptionRepo.createSubscription({
      userId: data.userId,
      planId: data.planId,
      status: "active",
      startDate: new Date(),
      endDate: data.endDate,
      stripeSubscriptionId: data.stripeSubscriptionId,
      stripeCustomerId: data.stripeCustomerId,
      tier: plan.tier,
      interval: plan.interval,
      paymentId: data.paymentId,
    });

    await this._userRepo.setUserRole(data.userId, "premium");

    return subscription;
  }

  async cancelSubscription(userId: string): Promise<ISubscription> {
    const subscription = await this.getUserActiveSubscription(userId);
    if (!subscription) {
      throw new CustomError(PAYMENT_MESSAGES.SUBSCRIPTION_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    }

    subscription.status = "cancelled";
    await subscription.save();

    await this._userRepo.setUserRole(userId, "user");

    return subscription;
  }

  async upgradeSubscription(userId: string, newPlanId: string): Promise<ISubscription> {
    const subscription = await this.getUserActiveSubscription(userId);
    if (!subscription) {
      throw new CustomError(PAYMENT_MESSAGES.SUBSCRIPTION_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const newPlan = await this._planRepo.findById(newPlanId);
    if (!newPlan) {
      throw new CustomError(PAYMENT_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    if (subscription.stripeSubscriptionId && newPlan.stripePriceId) {
      const stripeSubs = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
      const itemId = stripeSubs.items.data[0].id;

      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        items: [{ id: itemId, price: newPlan.stripePriceId }],
      });
    }

    subscription.planId = newPlanId;
    subscription.tier = newPlan.tier;

    if (newPlan.durationInDays) {
      const newEndDate = new Date();
      newEndDate.setDate(newEndDate.getDate() + newPlan.durationInDays);
      subscription.endDate = newEndDate;
    }

    await subscription.save();
    return subscription;
  }

  async downgradeSubscription(userId: string, newPlanId: string): Promise<ISubscription> {
    const subscription = await this.getUserActiveSubscription(userId);
    if (!subscription) {
      throw new CustomError(PAYMENT_MESSAGES.SUBSCRIPTION_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const newPlan = await this._planRepo.findById(newPlanId);
    if (!newPlan) {
      throw new CustomError(PAYMENT_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    if (subscription.stripeSubscriptionId && newPlan.stripePriceId) {
      const stripeSubs = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
      const itemId = stripeSubs.items.data[0].id;

      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        items: [{ id: itemId, price: newPlan.stripePriceId }],
        proration_behavior: "none",
        billing_cycle_anchor: "unchanged",
      });
    }

    subscription.planId = newPlanId;
    subscription.tier = newPlan.tier;

    await subscription.save();
    return subscription;
  }

  async expireSubscription(subscriptionId: string): Promise<void> {
    const subscription = await this._subscriptionRepo.findById(subscriptionId);
    if (!subscription) {
      throw new CustomError(PAYMENT_MESSAGES.SUBSCRIPTION_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    subscription.status = "expired";
    await subscription.save();

    await this._userRepo.setUserRole(subscription.userId.toString(), "user");
  }
}
