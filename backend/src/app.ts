import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { CLIENT_URL } from './utils/constants';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import errorMiddleware from './middlewares/errorMiddleware';
import { setupSwagger } from './utils/swaggerConfig';

import authRoutes from './routes/auth.routes';
import contentRoutes from './routes/content.routes';
import adminRoutes from './routes/admin.routes';
import squadRouters from './routes/squads.routes';
import userRoutes from './routes/user.routes';
import mentorRoutes from './routes/mentor.routes';
import followerRoutes from './routes/followers.routes';
import chatRoutes from './routes/chat.routes';
import messageRoutes from './routes/message.routes';
import planRoutes from './routes/plan.routes';

const app = express();
setupSwagger(app);

const corsOptions = {
  origin: CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/admin', adminRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/squad', squadRouters);
app.use('/api/user', userRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/followers', followerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/plans', planRoutes);

app.use(errorMiddleware);

export default app;
