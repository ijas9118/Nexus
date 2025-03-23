export const HOST = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
export const API = `${HOST}/api`;
export const AUTH_ROUTE = `${API}/auth`;

export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_OTP: "/auth/verify-otp",
  RESEND_OTP: "/auth/resend-otp",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  LOGOUT: "/auth/logout",
  GOOGLE: `${AUTH_ROUTE}/google`,
  GITHUB: `${AUTH_ROUTE}/github`,
} as const;

export const CONTENT_ROUTES = {
  POST: "/content/posts",
  GET_FOLLOWING_POSTS: "/content/posts/following",
  GET_HISTORY: "/content/history/",
  REMOVE_FROM_HISTORY: "/content/history/remove",
  BOOKMARKS: "/content/posts/bookmarks",
  COMMENTS: "/content/comment",
} as const;
