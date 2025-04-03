import { IChannelService } from '@/core/interfaces/services/IChannelService';
import { IMessageService } from '@/core/interfaces/services/IMessageService';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import ChannelModel from '@/models/channel.model';
import { IMessage } from '@/models/message.model';
import { CLIENT_URL } from '@/utils/constants';
import { Server } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';

const setUpSocket = (server: Server) => {
  const messageService = container.get<IMessageService>(TYPES.MessageService);
  const channelService = container.get<IChannelService>(TYPES.ChannelService);

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
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createdMessage = await messageService.createMessage(message);

    const messageData = await messageService.getMessageById(createdMessage._id as string, false);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('recieveMessage', messageData);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit('recieveMessage', messageData);
    }
  };

  const sendChannelMessage = async (message: any) => {
    const { channelId, sender, content, messageType, fileUrl } = message;

    const createdMessage = await messageService.createMessage({
      sender,
      recipient: undefined,
      content,
      messageType,
      fileUrl,
    });

    const messageData = await messageService.getMessageById(createdMessage._id as string, true);

    console.log(messageData);

    await channelService.addMessageToChannel(channelId, createdMessage._id as string);

    const channel = await channelService.getChannelById(channelId);

    const finalData = { ...messageData, channelId: channel?._id };

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());

        if (memberSocketId) {
          io.to(memberSocketId).emit('recieve-channel-message', finalData);
        }
      });

      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit('recieve-channel-message', finalData);
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

    socket.on('sendMessage', sendMessage);

    socket.on('send-channel-message', sendChannelMessage);

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
