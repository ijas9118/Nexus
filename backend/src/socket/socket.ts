import { SocketController } from '@/controllers/socket.controller';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { CLIENT_URL } from '@/utils/constants';
import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';

const setUpSocket = (server: Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const socketController = container.get<SocketController>(TYPES.SocketController);
  socketController.initializeSocket(io);

  return io;
};

export default setUpSocket;
