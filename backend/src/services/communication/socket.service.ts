import type { Socket, Server as SocketIOServer } from "socket.io";

import { inject, injectable } from "inversify";

import type { IChatService } from "@/core/interfaces/services/i-chat-service";
import type { IGroupService } from "@/core/interfaces/services/i-group-service";
import type { IMessageService } from "@/core/interfaces/services/i-message-service";
import type { ISocketService } from "@/core/interfaces/services/i-socket-service";

import logger from "@/config/logger";
import { TYPES } from "@/di/types";

@injectable()
export class SocketService implements ISocketService {
  private _userSocketMap: Map<string, string> = new Map();
  private _videoRoomUsers: Map<string, { userId: string; peerId: string }[]> = new Map();

  constructor(
    @inject(TYPES.ChatService) private _chatService: IChatService,
    @inject(TYPES.GroupService) private _groupService: IGroupService,
    @inject(TYPES.MessageService) private _messageService: IMessageService,
  ) {}

  setUserSocket(userId: string, socketId: string): void {
    this._userSocketMap.set(userId, socketId);
  }

  getUserSocket(userId: string): string | undefined {
    return this._userSocketMap.get(userId);
  }

  removeUserSocket(userId: string): void {
    this._userSocketMap.delete(userId);
  }

  async joinUserRooms(userId: string, socket: Socket): Promise<void> {
    const chats = await this._chatService.getUserChats(userId);
    const groups = await this._groupService.getUserGroups(userId);
    const rooms = [
      ...chats.map(chat => chat._id.toString()),
      ...groups.map(group => group._id.toString()),
    ];
    socket.join(rooms);
  }

  handleJoinVideoRoom(userId: string, roomId: string, peerId: string, socket: Socket): void {
    try {
      socket.join(roomId);

      if (!this._videoRoomUsers.has(roomId)) {
        this._videoRoomUsers.set(roomId, []);
      }

      const roomUsers = this._videoRoomUsers.get(roomId)!;
      roomUsers.push({ userId, peerId });
      this._videoRoomUsers.set(roomId, roomUsers);

      socket.to(roomId).emit("user-joined", { peerId });
      socket.emit("room-users", { users: roomUsers.filter(user => user.userId !== userId) });
    }
    catch (error) {
      socket.emit("error", (error as Error).message);
    }
  }

  handleLeaveVideoRoom(userId: string, roomId: string, socket: Socket, io: SocketIOServer): void {
    try {
      socket.leave(roomId);

      const roomUsers = this._videoRoomUsers.get(roomId);
      if (roomUsers) {
        const updatedUsers = roomUsers.filter(user => user.userId !== userId);
        if (updatedUsers.length === 0) {
          this._videoRoomUsers.delete(roomId);
        }
        else {
          this._videoRoomUsers.set(roomId, updatedUsers);
        }

        io.to(roomId).emit("user-disconnected", { userId });
      }
    }
    catch (error) {
      socket.emit("error", (error as Error).message);
    }
  }

  async handleCreateChat(
    userId: string,
    otherUserId: string,
    socket: Socket,
    io: SocketIOServer,
  ): Promise<void> {
    try {
      const chat = await this._chatService.createChat(userId, otherUserId);
      socket.join(chat._id.toString());

      const otherSocketId = this.getUserSocket(otherUserId);
      if (otherSocketId) {
        io.to(otherSocketId).emit("chatCreated", chat);
        io.sockets.sockets.get(otherSocketId)?.join(chat._id.toString());
      }

      socket.emit("chatCreated", chat);
    }
    catch (error) {
      socket.emit("error", (error as Error).message);
    }
  }

  async handleCreateGroup(
    userId: string,
    name: string,
    memberIds: string[],
    socket: Socket,
    io: SocketIOServer,
  ): Promise<void> {
    try {
      const group = await this._groupService.createGroup(userId, name, memberIds);
      const groupId = group._id.toString();
      socket.join(groupId);

      memberIds.forEach((memberId) => {
        const memberSocketId = this.getUserSocket(memberId);
        if (memberSocketId) {
          io.to(memberSocketId).emit("groupCreated", group);
          io.sockets.sockets.get(memberSocketId)?.join(groupId);
        }
      });

      socket.emit("groupCreated", group);
    }
    catch (error) {
      socket.emit("error", (error as Error).message);
    }
  }

  async handleSendMessage(
    userId: string,
    data: {
      chatId: string;
      chatType: "Chat" | "Group";
      content?: string;
      fileUrl?: string;
      fileType?: "image" | "video" | "pdf";
      replyTo?: string;
    },
    socket: Socket,
    io: SocketIOServer,
  ): Promise<void> {
    try {
      let actualChatId = data.chatId;
      if (data.chatType === "Chat") {
        const existingChat = await this._chatService.findById(data.chatId).catch(() => null);
        if (!existingChat) {
          const chat = await this._chatService.createChat(userId, data.chatId);
          actualChatId = chat._id.toString();
          socket.join(actualChatId);

          const otherSocketId = this.getUserSocket(data.chatId);
          if (otherSocketId) {
            io.to(otherSocketId).emit("chatCreated", chat);
            io.sockets.sockets.get(otherSocketId)?.join(actualChatId);
          }
          socket.emit("chatCreated", chat);
        }
      }

      const message = await this._messageService.sendMessage(
        userId,
        actualChatId,
        data.chatType,
        data.content,
        data.fileUrl,
        data.fileType,
        data.replyTo,
        io,
      );

      socket.emit("messageSent", message);
    }
    catch (error) {
      logger.error("Error in handleSendMessage:", error);
      socket.emit("error", (error as Error).message);
    }
  }

  handleDisconnect(userId: string, socket: Socket): void {
    this.removeUserSocket(userId);
    this._videoRoomUsers.forEach((users, roomId) => {
      const updatedUsers = users.filter(user => user.userId !== userId);
      if (updatedUsers.length === 0) {
        this._videoRoomUsers.delete(roomId);
      }
      else {
        this._videoRoomUsers.set(roomId, updatedUsers);
        socket.to(roomId).emit("user-disconnected", { userId });
      }
    });
    logger.info(`User disconnected: ${userId}`);
  }
}
