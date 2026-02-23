import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { StatusCodes } from "http-status-codes";

import passport from "./config/passport";
import { startCleanupJob } from "./jobs/cleanup-expired-reservations";
import errorMiddleware from "./middlewares/error-middleware";
import { httpLogger } from "./middlewares/http-logger";
import routes from "./routes";
import { env } from "./utils/env-validation";
import { setupSwagger } from "./utils/swagger-config";

const app = express();
app.set("trust proxy", true); // Trust all proxies for secure cookies

setupSwagger(app);

// Normalize origin to remove trailing slash
const clientUrl = env.CLIENT_URL.endsWith("/") ? env.CLIENT_URL.slice(0, -1) : env.CLIENT_URL;

const corsOptions = {
  origin: [
    clientUrl,
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  credentials: true,
};

app.use("/api/webhook", express.raw({ type: "application/json" }), routes.webhook);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(httpLogger);

app.use(passport.initialize());

app.use("/api", routes.main);

app.get("/health", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Server is healthy" });
});

app.use(errorMiddleware);

startCleanupJob();

export default app;
