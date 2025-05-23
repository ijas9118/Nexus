import { IChatService } from '@/core/interfaces/services/IChatService';
import { IGroupService } from '@/core/interfaces/services/IGroupService';
import { IMessageService } from '@/core/interfaces/services/IMessageService';
import { TYPES } from '@/di/types';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import logger from '@/config/logger';

@injectable()
export class SocketController {
  private userSocketMap: Map<string, string> = new Map();
  private videoRoomUsers: Map<string, { userId: string; peerId: string }[]> = new Map();

  constructor(
    @inject(TYPES.ChatService) private chatService: IChatService,
    @inject(TYPES.GroupService) private groupService: IGroupService,
    @inject(TYPES.MessageService) private messageService: IMessageService
  ) {}

  public initializeSocket(io: SocketIOServer): void {
    io.on('connection', (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;
      if (!userId) {
        socket.disconnect();
        return;
      }

      // Store user socket mapping
      this.userSocketMap.set(userId, socket.id);
      logger.info(`User connected: ${userId} with socket ID: ${socket.id}`);

      // Join user to their chats and groups
      this.joinUserRooms(userId, socket);

      // Emit user's socket ID to themselves
      socket.emit('me', socket.id);

      // Video call events
      socket.on('join-video-room', ({ roomId, peerId }) => {
        this.handleJoinVideoRoom(userId, roomId, peerId, socket);
      });

      socket.on('leave-video-room', ({ roomId }) => {
        this.handleLeaveVideoRoom(userId, roomId, socket, io);
      });

      // Existing chat events (unchanged)
      socket.on('createChat', (otherUserId: string) =>
        this.handleCreateChat(userId, otherUserId, socket, io)
      );
      socket.on('createGroup', ({ name, memberIds }: { name: string; memberIds: string[] }) =>
        this.handleCreateGroup(userId, name, memberIds, socket, io)
      );
      socket.on(
        'sendMessage',
        (data: {
          chatId: string;
          chatType: 'Chat' | 'Group';
          content?: string;
          fileUrl?: string;
          fileType?: 'image' | 'video' | 'pdf';
          replyTo?: string;
        }) => this.handleSendMessage(userId, data, socket, io)
      );
      socket.on(
        'reactToMessage',
        ({ messageId, reaction }: { messageId: string; reaction: string }) =>
          this.handleReactToMessage(userId, messageId, reaction, io)
      );
      socket.on('removeReaction', (messageId: string) =>
        this.handleRemoveReaction(userId, messageId, io)
      );
      socket.on('deleteMessage', (messageId: string) =>
        this.handleDeleteMessage(userId, messageId, io)
      );
      socket.on(
        'markMessagesAsRead',
        ({ chatId, chatType }: { chatId: string; chatType: 'Chat' | 'Group' }) => {
          this.handleMarkMessagesAsRead(userId, chatId, chatType, io);
        }
      );

      // Handle disconnection
      socket.on('disconnect', () => this.handleDisconnect(userId, socket));
    });
  }

  private async handleJoinVideoRoom(
    userId: string,
    roomId: string,
    peerId: string,
    socket: Socket
  ): Promise<void> {
    try {
      // Join the socket room
      socket.join(roomId);

      // Initialize room if it doesn't exist
      if (!this.videoRoomUsers.has(roomId)) {
        this.videoRoomUsers.set(roomId, []);
      }

      // Add user to room
      const roomUsers = this.videoRoomUsers.get(roomId)!;
      roomUsers.push({ userId, peerId });
      this.videoRoomUsers.set(roomId, roomUsers);

      // Notify other users in the room
      socket.to(roomId).emit('user-joined', { peerId });

      // Send current room users to the joining user
      socket.emit('room-users', { users: roomUsers.filter((user) => user.userId !== userId) });
    } catch (error) {
      socket.emit('error', (error as Error).message);
    }
  }

  private async handleLeaveVideoRoom(
    userId: string,
    roomId: string,
    socket: Socket,
    io: SocketIOServer
  ): Promise<void> {
    try {
      socket.leave(roomId);

      // Remove user from room
      const roomUsers = this.videoRoomUsers.get(roomId);
      if (roomUsers) {
        const updatedUsers = roomUsers.filter((user) => user.userId !== userId);
        if (updatedUsers.length === 0) {
          this.videoRoomUsers.delete(roomId);
        } else {
          this.videoRoomUsers.set(roomId, updatedUsers);
        }

        // Notify remaining users
        io.to(roomId).emit('user-disconnected', { userId });
      }
    } catch (error) {
      socket.emit('error', (error as Error).message);
    }
  }

  private async joinUserRooms(userId: string, socket: Socket): Promise<void> {
    const chats = await this.chatService.getUserChats(userId);
    const groups = await this.groupService.getUserGroups(userId);
    const rooms = [
      ...chats.map((chat) => chat._id.toString()),
      ...groups.map((group) => group._id.toString()),
    ];
    socket.join(rooms);
  }

  private async handleCreateChat(
    userId: string,
    otherUserId: string,
    socket: Socket,
    io: SocketIOServer
  ): Promise<void> {
    try {
      const chat = await this.chatService.createChat(userId, otherUserId);
      socket.join(chat._id.toString());

      const otherSocketId = this.userSocketMap.get(otherUserId);
      if (otherSocketId) {
        io.to(otherSocketId).emit('chatCreated', chat);
        io.sockets.sockets.get(otherSocketId)?.join(chat._id.toString());
      }

      socket.emit('chatCreated', chat);
    } catch (error) {
      socket.emit('error', (error as Error).message);
    }
  }

  private async handleCreateGroup(
    userId: string,
    name: string,
    memberIds: string[],
    socket: Socket,
    io: SocketIOServer
  ): Promise<void> {
    try {
      const group = await this.groupService.createGroup(userId, name, memberIds);
      const groupId = group._id.toString();
      socket.join(groupId);

      memberIds.forEach((memberId) => {
        const memberSocketId = this.userSocketMap.get(memberId);
        if (memberSocketId) {
          io.to(memberSocketId).emit('groupCreated', group);
          io.sockets.sockets.get(memberSocketId)?.join(groupId);
        }
      });

      socket.emit('groupCreated', group);
    } catch (error) {
      socket.emit('error', (error as Error).message);
    }
  }

  private async handleSendMessage(
    userId: string,
    data: {
      chatId: string;
      chatType: 'Chat' | 'Group';
      content?: string;
      fileUrl?: string;
      fileType?: 'image' | 'video' | 'pdf';
      replyTo?: string;
    },
    socket: Socket,
    io: SocketIOServer
  ): Promise<void> {
    try {
      let actualChatId = data.chatId;
      if (data.chatType === 'Chat') {
        const existingChat = await this.chatService.findById(data.chatId).catch(() => null);
        if (!existingChat) {
          const chat = await this.chatService.createChat(userId, data.chatId);
          actualChatId = chat._id.toString();
          socket.join(actualChatId);

          const otherSocketId = this.userSocketMap.get(data.chatId);
          if (otherSocketId) {
            io.to(otherSocketId).emit('chatCreated', chat);
            io.sockets.sockets.get(otherSocketId)?.join(actualChatId);
          }
          socket.emit('chatCreated', chat);
        }
      }

      const message = await this.messageService.sendMessage(
        userId,
        actualChatId,
        data.chatType,
        data.content,
        data.fileUrl,
        data.fileType,
        data.replyTo,
        io
      );

      socket.emit('messageSent', message);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      socket.emit('error', (error as Error).message);
    }
  }

  private async handleReactToMessage(
    userId: string,
    messageId: string,
    reaction: string,
    io: SocketIOServer
  ): Promise<void> {
    try {
      await this.messageService.addReaction(userId, messageId, reaction, io);
    } catch (error) {
      io.to(this.userSocketMap.get(userId) || '').emit('error', (error as Error).message);
    }
  }

  private async handleRemoveReaction(
    userId: string,
    messageId: string,
    io: SocketIOServer
  ): Promise<void> {
    try {
      await this.messageService.removeReaction(userId, messageId, io);
    } catch (error) {
      io.to(this.userSocketMap.get(userId) || '').emit('error', (error as Error).message);
    }
  }

  private async handleDeleteMessage(
    userId: string,
    messageId: string,
    io: SocketIOServer
  ): Promise<void> {
    try {
      await this.messageService.deleteMessage(userId, messageId, io);
    } catch (error) {
      io.to(this.userSocketMap.get(userId) || '').emit('error', (error as Error).message);
    }
  }

  private async handleMarkMessagesAsRead(
    userId: string,
    chatId: string,
    chatType: 'Chat' | 'Group',
    io: SocketIOServer
  ): Promise<void> {
    try {
      await this.messageService.markMessagesAsRead(userId, chatId, chatType, io);
    } catch (error) {
      io.to(this.userSocketMap.get(userId) || '').emit('error', (error as Error).message);
    }
  }

  private handleDisconnect(userId: string, socket: Socket): void {
    this.userSocketMap.delete(userId);
    // Clean up video rooms
    this.videoRoomUsers.forEach((users, roomId) => {
      const updatedUsers = users.filter((user) => user.userId !== userId);
      if (updatedUsers.length === 0) {
        this.videoRoomUsers.delete(roomId);
      } else {
        this.videoRoomUsers.set(roomId, updatedUsers);
        socket.to(roomId).emit('user-disconnected', { userId });
      }
    });
    logger.info(`User disconnected: ${userId}`);
  }
}
