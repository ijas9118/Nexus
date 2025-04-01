import ChannelModel from '@/models/channel.model';
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

  const sendChannelMessage = async (message: any) => {
    console.log(message.channelId);
    const { channelId, sender, content, messageType, fileUrl } = message;

    const createdMessage = await MessageModel.create({
      sender,
      recipient: null,
      content,
      messageType,
      fileUrl,
    });

    const messageData = await MessageModel.findById(createdMessage._id)
      .populate('sender', '_id email name profilePic username')
      .lean()
      .exec();

    console.log(messageData);

    await ChannelModel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });

    const channel = await ChannelModel.findById(channelId).populate('members');

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
    } else {
      console.log('User ID not provided during connection');
    }

    socket.on('sendMessage', sendMessage);

    socket.on('send-channel-message', sendChannelMessage);

    socket.on('disconnect', () => disconnect(socket));
  });
};

export default setUpSocket;
