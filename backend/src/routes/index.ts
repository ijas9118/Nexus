import { Router } from "express";

import adminRoutes from "./admin.routes";
import authRoutes from "./auth/auth.routes";
import bookingPaymentRoutes from "./booking/booking-payment.routes";
import bookingRoutes from "./booking/booking.routes";
import globalSearchRoute from "./common/global-search.routes";
import chatRoutes from "./communication/chat.routes";
import notificationTypeRoutes from "./communication/notification-type.routes";
import notificationRoutes from "./communication/notification.routes";
import contentRoutes from "./content/content.routes";
import squadRoutes from "./content/squads.routes";
import mentorMetadataRoutes from "./mentor/mentor-metadata.routes";
import mentorRoutes from "./mentor/mentor.routes";
import mentorshipTypeRoutes from "./mentor/mentorship-type.routes";
import targetAudienceRoutes from "./mentor/target-audience.routes";
import timeSlotRoutes from "./mentor/time-slot.routes";
import paymentRoutes from "./payment/payment.routes";
import planRoutes from "./payment/plan.routes";
import subscriptionRoutes from "./payment/subscription.routes";
import walletRoutes from "./payment/wallet.routes";
import webhookRouter from "./payment/webhook.routes";
import followerRoutes from "./user/followers.routes";
import userRoutes from "./user/user.routes";

const mainRouter = Router();

mainRouter.use("/admin", adminRoutes);
mainRouter.use("/auth", authRoutes);
mainRouter.use("/content", contentRoutes);
mainRouter.use("/squad", squadRoutes);
mainRouter.use("/user", userRoutes);
mainRouter.use("/mentor", mentorRoutes);
mainRouter.use("/mentor/time-slot", timeSlotRoutes);
mainRouter.use("/mentorship-type", mentorshipTypeRoutes);
mainRouter.use("/mentor-metadata", mentorMetadataRoutes);
mainRouter.use("/followers", followerRoutes);
mainRouter.use("/plans", planRoutes);
mainRouter.use("/payment", paymentRoutes);
mainRouter.use("/chat", chatRoutes);
mainRouter.use("/subscription", subscriptionRoutes);
mainRouter.use("/target-audiences", targetAudienceRoutes);
mainRouter.use("/bookings", bookingRoutes);
mainRouter.use("/booking-payment", bookingPaymentRoutes);
mainRouter.use("/notification-types", notificationTypeRoutes);
mainRouter.use("/notifications", notificationRoutes);
mainRouter.use("/wallet", walletRoutes);
mainRouter.use("/search", globalSearchRoute);

export default {
  main: mainRouter,
  webhook: webhookRouter,
};
