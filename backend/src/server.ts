import 'reflect-metadata';

import app from './app';
import { connectDB } from './config/database.config';
import logger from './config/logger';
import setUpSocket from './socket/socket';
import { env } from './utils/env-validation';

async function startServer() {
  try {
    await connectDB();
    const server = app.listen(env.PORT, () =>
      logger.info(`Server is running on http://localhost:${env.PORT}`)
    );

    setUpSocket(server);
  } catch (error) {
    logger.error('Failed to start the server:', error);
  }
}

startServer();
