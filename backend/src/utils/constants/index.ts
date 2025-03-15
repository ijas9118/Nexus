import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const CLIENT_URL = process.env.CLIENT_URL;
export const MONGO_URI = process.env.MONGO_URI;
export const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET;
export const NODE_ENV = process.env.NODE_ENV;
export const USER_EMAIL = process.env.USER_EMAIL;
export const APP_PASSWORD = process.env.APP_PASSWORD;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
