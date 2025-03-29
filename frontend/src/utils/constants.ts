export const HOST = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const AUTH_ROUTE = "/auth";
const CONTENT_ROUTE = "/content";
const MESSAGE_ROUTE = "/message";
const CHANNEL_ROUTE = "/channel";

export const AUTH_ROUTES = {
  LOGIN: `${AUTH_ROUTE}/login`,
  REGISTER: `${AUTH_ROUTE}/register`,
  VERIFY_OTP: `${AUTH_ROUTE}/verify-otp`,
  RESEND_OTP: `${AUTH_ROUTE}/resend-otp`,
  FORGOT_PASSWORD: `${AUTH_ROUTE}/forgot-password`,
  RESET_PASSWORD: `${AUTH_ROUTE}/reset-password`,
  LOGOUT: `${AUTH_ROUTE}/logout`,
  GOOGLE: `${HOST}/api/auth/google`,
  GITHUB: `${HOST}/api/auth/github`,
} as const;

export const CONTENT_ROUTES = {
  POST: `${CONTENT_ROUTE}/posts`,
  GET_FOLLOWING_POSTS: `${CONTENT_ROUTE}/posts/following`,
  GET_HISTORY: `${CONTENT_ROUTE}/history/`,
  REMOVE_FROM_HISTORY: `${CONTENT_ROUTE}/history/remove`,
  BOOKMARKS: `${CONTENT_ROUTE}/posts/bookmarks`,
  COMMENTS: `${CONTENT_ROUTE}/comment`,
} as const;

export const MESSAGE_ROUTES = {
  GET_MESSAGES: `${MESSAGE_ROUTE}/get-messages`,
  GET_USERS_WITH_CHAT: `${MESSAGE_ROUTE}/get-users-with-chat`,
  UPLOAD_FILE: `${MESSAGE_ROUTE}/upload-file`,
} as const;

export const CHANNEL_ROUTES = {
  CREATE_CHANNEL: `${CHANNEL_ROUTE}/create-channel`,
  GET_USER_CHANNELS: `${CHANNEL_ROUTE}/get-user-channels`,
} as const;
