import { Router } from 'express';

import adminRoutes from './admin.routes';
import authRoutes from './auth.routes';
import contentRoutes from './content.routes';
import squadRoutes from './squads.routes';
import userRoutes from './user.routes';
import mentorRoutes from './mentor.routes';
import timeSlotRoutes from './time-slot.routes';
import mentorshipTypeRoutes from './mentorship-type.routes';
import mentorMetadataRoutes from './mentor-metadata.routes';
import followerRoutes from './followers.routes';
import planRoutes from './plan.routes';
import paymentRoutes from './payment.routes';
import chatRoutes from './chat.routes';
import subscriptionRoutes from './subscription.routes';
import targetAudienceRoutes from './targetAudience.routes';
import bookingRoutes from './booking.routes';
import bookingPaymentRoutes from './bookingPayment.routes';
import notificationTypeRoutes from './notificationType.routes';
import notificationRoutes from './notification.routes';
import walletRoutes from './wallet.routes';
import globalSearchRoute from './globalSearch.routes';
import webhookRouter from './webhook.routes';

const mainRouter = Router();

mainRouter.use('/admin', adminRoutes);
mainRouter.use('/auth', authRoutes);
mainRouter.use('/content', contentRoutes);
mainRouter.use('/squad', squadRoutes);
mainRouter.use('/user', userRoutes);
mainRouter.use('/mentor', mentorRoutes);
mainRouter.use('/mentor/time-slot', timeSlotRoutes);
mainRouter.use('/mentorship-type', mentorshipTypeRoutes);
mainRouter.use('/mentor-metadata', mentorMetadataRoutes);
mainRouter.use('/followers', followerRoutes);
mainRouter.use('/plans', planRoutes);
mainRouter.use('/payment', paymentRoutes);
mainRouter.use('/chat', chatRoutes);
mainRouter.use('/subscription', subscriptionRoutes);
mainRouter.use('/target-audiences', targetAudienceRoutes);
mainRouter.use('/bookings', bookingRoutes);
mainRouter.use('/booking-payment', bookingPaymentRoutes);
mainRouter.use('/notification-types', notificationTypeRoutes);
mainRouter.use('/notifications', notificationRoutes);
mainRouter.use('/wallet', walletRoutes);
mainRouter.use('/search', globalSearchRoute);

export default {
  main: mainRouter,
  webhook: webhookRouter,
};
