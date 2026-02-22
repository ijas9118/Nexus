import type { Socket, Server as SocketIOServer } from "socket.io";

import { inject, injectable } from "inversify";

import type { IMessageService } from "@/core/interfaces/services/i-message-service";
import type { ISocketService } from "@/core/interfaces/services/i-socket-service";

import logger from "@/config/logger";
import { TYPES } from "@/di/types";

@injectable()
export class SocketController {
  constructor(
    @inject(TYPES.SocketService) private socketService: ISocketService,
    @inject(TYPES.MessageService) private messageService: IMessageService,
  ) {}

  public initializeSocket(io: SocketIOServer): void {
    io.on("connection", (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;
      if (!userId) {
        socket.disconnect();
        return;
      }

      // Store user socket mapping
      this.socketService.setUserSocket(userId, socket.id);
      logger.info(`User connected: ${userId} with socket ID: ${socket.id}`);

      // Join user to their chats and groups
      this.socketService.joinUserRooms(userId, socket);

      // Emit user's socket ID to themselves
      socket.emit("me", socket.id);

      // Video call events
      socket.on("join-video-room", ({ roomId, peerId }) => {
        this.socketService.handleJoinVideoRoom(userId, roomId, peerId, socket);
      });

      socket.on("leave-video-room", ({ roomId }) => {
        this.socketService.handleLeaveVideoRoom(userId, roomId, socket, io);
      });

      // Existing chat events
      socket.on("createChat", (otherUserId: string) =>
        this.socketService.handleCreateChat(userId, otherUserId, socket, io));

      socket.on("createGroup", ({ name, memberIds }: { name: string; memberIds: string[] }) =>
        this.socketService.handleCreateGroup(userId, name, memberIds, socket, io));

      socket.on(
        "sendMessage",
        (data: {
          chatId: string;
          chatType: "Chat" | "Group";
          content?: string;
          fileUrl?: string;
          fileType?: "image" | "video" | "pdf";
          replyTo?: string;
        }) => this.socketService.handleSendMessage(userId, data, socket, io),
      );

      socket.on(
        "reactToMessage",
        ({ messageId, reaction }: { messageId: string; reaction: string }) =>
          this.handleReactToMessage(userId, messageId, reaction, io),
      );

      socket.on("removeReaction", (messageId: string) =>
        this.handleRemoveReaction(userId, messageId, io));

      socket.on("deleteMessage", (messageId: string) =>
        this.handleDeleteMessage(userId, messageId, io));

      socket.on(
        "markMessagesAsRead",
        ({ chatId, chatType }: { chatId: string; chatType: "Chat" | "Group" }) => {
          this.handleMarkMessagesAsRead(userId, chatId, chatType, io);
        },
      );

      // Handle disconnection
      socket.on("disconnect", () => this.socketService.handleDisconnect(userId, socket));
    });
  }

  private async handleReactToMessage(
    userId: string,
    messageId: string,
    reaction: string,
    io: SocketIOServer,
  ): Promise<void> {
    try {
      await this.messageService.addReaction(userId, messageId, reaction, io);
    }
    catch (error) {
      const socketId = this.socketService.getUserSocket(userId);
      if (socketId) {
        io.to(socketId).emit("error", (error as Error).message);
      }
    }
  }

  private async handleRemoveReaction(
    userId: string,
    messageId: string,
    io: SocketIOServer,
  ): Promise<void> {
    try {
      await this.messageService.removeReaction(userId, messageId, io);
    }
    catch (error) {
      const socketId = this.socketService.getUserSocket(userId);
      if (socketId) {
        io.to(socketId).emit("error", (error as Error).message);
      }
    }
  }

  private async handleDeleteMessage(
    userId: string,
    messageId: string,
    io: SocketIOServer,
  ): Promise<void> {
    try {
      await this.messageService.deleteMessage(userId, messageId, io);
    }
    catch (error) {
      const socketId = this.socketService.getUserSocket(userId);
      if (socketId) {
        io.to(socketId).emit("error", (error as Error).message);
      }
    }
  }

  private async handleMarkMessagesAsRead(
    userId: string,
    chatId: string,
    chatType: "Chat" | "Group",
    io: SocketIOServer,
  ): Promise<void> {
    try {
      await this.messageService.markMessagesAsRead(userId, chatId, chatType, io);
    }
    catch (error) {
      const socketId = this.socketService.getUserSocket(userId);
      if (socketId) {
        io.to(socketId).emit("error", (error as Error).message);
      }
    }
  }
}
