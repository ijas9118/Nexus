import type { Server } from "node:http";

import { Server as SocketIOServer } from "socket.io";

import type { SocketController } from "@/controllers/communication/socket.controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";

import { env } from "../utils/env-validation";

function setUpSocket(server: Server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const socketController = container.get<SocketController>(TYPES.SocketController);
  socketController.initializeSocket(io);

  return io;
}

export default setUpSocket;
