import express from 'express';
import cors from 'cors';
import { CLIENT_URL } from './utils/constants';
import cookieParser from 'cookie-parser';

import errorMiddleware from './middlewares/errorMiddleware';
import { setupSwagger } from './utils/swaggerConfig';

import passport from './config/passport';
import { httpLogger } from './middlewares/httpLogger';
import { startCleanupJob } from './jobs/cleanup-expired-reservations';

import routes from './routes';
import { StatusCodes } from 'http-status-codes';

const app = express();
setupSwagger(app);

const corsOptions = {
  origin: CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use('/api/webhook', express.raw({ type: 'application/json' }), routes.webhook);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(httpLogger);

app.use(passport.initialize());

app.use('/api', routes.main);

app.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Server is healthy' });
});

app.use(errorMiddleware);

startCleanupJob();

export default app;
