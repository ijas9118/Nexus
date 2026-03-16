import { CronJob } from "cron";

import type { ISubscriptionRepository } from "@/core/interfaces/repositories/i-subscription-repository";
import type { IUserRepository } from "@/core/interfaces/repositories/i-user-repository";

import logger from "@/config/logger";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";

const subscriptionRepository = container.get<ISubscriptionRepository>(TYPES.SubscriptionRepository);
const userRepository = container.get<IUserRepository>(TYPES.UserRepository);

const expireSubscriptionsJob = new CronJob("0 * * * *", async () => {
  try {
    const expiredSubscriptions = await subscriptionRepository.findExpiredActiveSubscriptions();

    if (expiredSubscriptions.length === 0) {
      return;
    }

    logger.info(`Found ${expiredSubscriptions.length} expired subscriptions to process`);

    for (const subscription of expiredSubscriptions) {
      try {
        subscription.status = "expired";
        await subscription.save();

        await userRepository.setUserRole(subscription.userId.toString(), "user");

        logger.info(`Expired subscription ${subscription._id} for user ${subscription.userId}`);
      }
      catch (err) {
        logger.error(`Error expiring subscription ${subscription._id}:`, err);
      }
    }
  }
  catch (error) {
    logger.error("Error running expire subscriptions job:", error);
  }
});

export function startExpireSubscriptionsJob() {
  expireSubscriptionsJob.start();
}
