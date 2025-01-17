import mongoose from "mongoose";
import { MONGO_URI } from "../utils/constants";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI || "");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
