import { CLIENT_URL } from '@/utils/constants';
import { Server } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';

const setUpSocket = (server: Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket: Socket) => {
    console.log(`Client disconnected: ${socket.id}`);

    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
      console.log('Current connected users:', Array.from(userSocketMap.entries()));
      socket.emit('me', socket.id);
    } else {
      console.log('User ID not provided during connection');
    }

    socket.on('disconnect', () => disconnect(socket));

    socket.on('call-user', (data) => {
      const recipientSocketId = userSocketMap.get(data.to);
      console.log(`Call request from ${userId} to ${data.to}`);
      console.log(`Recipient socket ID: ${recipientSocketId}`);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('call-made', {
          signal: data.signal,
          from: userId,
        });
        console.log(`Emitted call-made to ${recipientSocketId}`);
      } else {
        console.log(`Recipient ${data.to} not found`);
      }
    });

    socket.on('answer-call', (data) => {
      const recipientSocketId = userSocketMap.get(data.to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('call-answered', {
          signal: data.signal,
          from: userId,
        });
      }
    });

    socket.on('reject-call', (data) => {
      const callerSocketId = userSocketMap.get(data.to);
      if (callerSocketId) {
        io.to(callerSocketId).emit('call-rejected', {
          from: userId,
        });
      }
    });

    socket.on('end-call', (data) => {
      const recipientSocketId = userSocketMap.get(data.to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('call-ended', {
          from: userId,
        });
      }
    });
  });
};

export default setUpSocket;
