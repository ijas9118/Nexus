import app from './app';
import { connectDB } from './config/database.config';
import setUpSocket from './socket/socket';
import { PORT } from './utils/constants';

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}`)
    );

    setUpSocket(server);
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();
