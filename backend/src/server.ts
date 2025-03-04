import app from "./app";
import { connectDB } from "./config/database.config";
import { CLIENT_URL, PORT } from "./utils/constants";
import { createServer } from "http";
import { Server } from "socket.io";

let io: Server;

const startServer = async () => {
  try {
    await connectDB();
    const httpServer = createServer(app);
    io = new Server(httpServer, {
      cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("New client connected");

      socket.on("joinChat", (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat: ${chatId}`);
      });

      socket.on("sendMessage", (message) => {
        io.to(message.chatId).emit("receiveMessage", message);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });

    httpServer.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
};

startServer();

export { io };
