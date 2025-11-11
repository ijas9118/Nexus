import 'reflect-metadata';
import app from './app';
import { connectDB } from './config/database.config';
import logger from './config/logger';
import setUpSocket from './socket/socket';
import { PORT } from './utils/constants';

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () =>
      logger.info(`Server is running on http://localhost:${PORT}`)
    );

    setUpSocket(server);
  } catch (error) {
    logger.error('Failed to start the server:', error);
  }
};

startServer();
