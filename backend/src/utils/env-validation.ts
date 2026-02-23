/* eslint-disable node/no-process-env */
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .default("3000")
    .transform(val => Number(val)),
  CLIENT_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGO_URI: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.string().transform(val => Number(val)),
  REDIS_PASSWORD: z.string().min(1),
  REDIS_USER: z.string().optional(),
  REDIS_TLS: z
    .string()
    .transform(val => val === "true")
    .optional(),
  ACCESS_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  USER_EMAIL: z.string().email(),
  APP_PASSWORD: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  PREMIUM_PLAN: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  GOOGLE_CALLBACK_URL: z.string().url(),
  GITHUB_CALLBACK_URL: z.string().url().optional(),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(parsed.error.format(), null, 4),
    );
    process.exit(1);
  }

  return parsed.data;
}

export const env = validateEnv();
