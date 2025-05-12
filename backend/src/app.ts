import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { CLIENT_URL } from './utils/constants';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import errorMiddleware from './middlewares/errorMiddleware';
import { setupSwagger } from './utils/swaggerConfig';

import passport from './config/passport';

import authRoutes from './routes/auth.routes';
import contentRoutes from './routes/content.routes';
import adminRoutes from './routes/admin.routes';
import squadRouters from './routes/squads.routes';
import userRoutes from './routes/user.routes';
import mentorRoutes from './routes/mentor.routes';
import followerRoutes from './routes/followers.routes';
import planRoutes from './routes/plan.routes';
import paymentRoutes from './routes/payment.routes';
import webhookRouter from './routes/webhook.routes';
import chatRoutes from './routes/chat.routes';
import timeSlotRoutes from './routes/time-slot.routes';
import subscriptionRoutes from './routes/subscription.routes';
import mentorshipTypeRoutes from './routes/mentorship-type.routes';
import mentorMetadataRoutes from './routes/mentor-metadata.routes';
import targetAudienceRoutes from './routes/targetAudience.routes';
import bookingPaymentRoutes from './routes/bookingPayment.routes';
import bookingRoutes from './routes/booking.routes';
import notificationTypeRoutes from './routes/notificationType.routes';
import notificationRoutes from './routes/notification.routes';
import walletRoutes from './routes/wallet.routes';

const app = express();
setupSwagger(app);

const corsOptions = {
  origin: CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRouter);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use(passport.initialize());

app.use('/api/admin', adminRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/squad', squadRouters);
app.use('/api/user', userRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/mentor/time-slot', timeSlotRoutes);
app.use('/api/mentorship-type', mentorshipTypeRoutes);
app.use('/api/mentor-metadata', mentorMetadataRoutes);
app.use('/api/followers', followerRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/target-audiences', targetAudienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/booking-payment', bookingPaymentRoutes);
app.use('/api/notification-types', notificationTypeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wallet', walletRoutes);

app.get('/api/', (req, res) => {
  res.json({ message: 'this is the backendadsf sadf asdf api' });
});

app.use(errorMiddleware);

export default app;
