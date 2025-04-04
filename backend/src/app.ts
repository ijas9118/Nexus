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
import messageRoutes from './routes/message.routes';
import planRoutes from './routes/plan.routes';
import paymentRoutes from './routes/payment.routes';
import webhookRouter from './routes/webhook.routes';
import channelRoutes from './routes/channel.routes';

const app = express();
setupSwagger(app);

const corsOptions = {
  origin: CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
app.use('/api/followers', followerRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/channel', channelRoutes);

app.use(errorMiddleware);

export default app;
