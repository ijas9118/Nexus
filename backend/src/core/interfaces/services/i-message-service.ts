import type { Server as SocketIOServer } from "socket.io";

import type { IMessage } from "@/models/message.model";

export interface IMessageService {
  sendMessage: (
    userId: string,
    chatId: string,
    chatType: "Chat" | "Group",
    content?: string,
    fileUrl?: string,
    fileType?: "image" | "video" | "pdf",
    replyTo?: string,
    io?: SocketIOServer,
  ) => Promise<IMessage>;
  addReaction: (
    userId: string,
    messageId: string,
    reaction: string,
    io?: SocketIOServer,
  ) => Promise<IMessage>;
  removeReaction: (userId: string, messageId: string, io?: SocketIOServer) => Promise<IMessage>;
  deleteMessage: (userId: string, messageId: string, io?: SocketIOServer) => Promise<IMessage>;
  getMessages: (userId: string, chatId: string, chatType: "Chat" | "Group") => Promise<IMessage[]>;
  getUnreadCount: (userId: string, chatId: string, chatType: "Chat" | "Group") => Promise<number>;
  markMessagesAsRead: (
    userId: string,
    chatId: string,
    chatType: "Chat" | "Group",
    io?: SocketIOServer,
  ) => Promise<void>;
}
