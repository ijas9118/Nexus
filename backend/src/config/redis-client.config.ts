import Redis from "ioredis";

import { env } from "../utils/env-validation";
import logger from "./logger";

const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  username: env.REDIS_USER || "default",
  password: env.REDIS_PASSWORD,
  tls: env.REDIS_TLS ? {} : undefined, // Enable TLS only if explicitly set
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on("connect", () => logger.info("Connected to Redis"));
redisClient.on("error", err => logger.error("Redis connection error:", err));

export default redisClient;
