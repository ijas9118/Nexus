import MessageModel, { IMessage } from '@/models/message.model';
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

  const sendMessage = async (message: Partial<IMessage>) => {
    console.log(message);
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createdMessage = await MessageModel.create(message);

    const messageData = await MessageModel.findById(createdMessage._id)
      .populate('sender', '_id name email profilePic username')
      .populate('recipient', '_id name email profilePic username');

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('recieveMessage', messageData);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit('recieveMessage', messageData);
    }
  };

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log('User ID not provided during connection');
    }

    socket.on('sendMessage', sendMessage);

    socket.on('disconnect', () => disconnect(socket));
  });
};

export default setUpSocket;
