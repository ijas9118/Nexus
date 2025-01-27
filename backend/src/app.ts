import "reflect-metadata";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/database.config";
import { CLIENT_URL, PORT } from "./utils/constants";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import contentRoutes from "./routes/content.routes";
import adminRoutes from "./routes/admin/admin.auth.route";
import likesRoutes from "./routes/likes.routes";

const app = express();

const corsOptions = {
  origin: CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/content", likesRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
};

startServer();
