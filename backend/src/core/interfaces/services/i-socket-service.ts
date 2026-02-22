import type { Socket, Server as SocketIOServer } from "socket.io";

export interface ISocketService {
  setUserSocket: (userId: string, socketId: string) => void;
  getUserSocket: (userId: string) => string | undefined;
  removeUserSocket: (userId: string) => void;

  joinUserRooms: (userId: string, socket: Socket) => Promise<void>;

  handleJoinVideoRoom: (userId: string, roomId: string, peerId: string, socket: Socket) => void;
  handleLeaveVideoRoom: (userId: string, roomId: string, socket: Socket, io: SocketIOServer) => void;

  handleDisconnect: (userId: string, socket: Socket) => void;

  // Orchestration methods
  handleCreateChat: (userId: string, otherUserId: string, socket: Socket, io: SocketIOServer) => Promise<void>;
  handleCreateGroup: (userId: string, name: string, memberIds: string[], socket: Socket, io: SocketIOServer) => Promise<void>;
  handleSendMessage: (
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
  ) => Promise<void>;
}
