import mongoose from "mongoose";

import { env } from "../utils/env-validation";
import logger from "./logger";

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI || "");
    logger.info("MongoDB connected");
  }
  catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}
