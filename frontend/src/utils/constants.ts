export const HOST = import.meta.env.VITE_API_BASE_URL;

const AUTH_ROUTE = "/auth";
const CONTENT_ROUTE = "/content";
const MESSAGE_ROUTE = "/message";
const MENTOR_ROUTE = "/mentor";
const BOOKING_ROUTE = "/bookings";
const BOOKING_PAYMENT_ROUTE = "/booking-payment";
const SEARCH_ROUTE = "/search";
const CHAT_ROUTE = "/chat";
const USER_ROUTE = "/user";
const SQUAD_ROUTE = "/squad";
const ADMIN_ROUTE = "/admin";
const FOLLOWER_ROUTE = "/followers";
const NOTIFICATION_ROUTE = "/notifications";
const NOTIFICATION_TYPE_ROUTE = "/notification-types";
const PAYMENT_ROUTE = "/payment";
const PLAN_ROUTE = "/plans";
const REVIEW_ROUTE = "/review";
const MENTOR_METADATA_ROUTE = "/mentor-metadata";
const MENTORSHIP_TYPE_ROUTE = "/mentorship-type";
const SUBSCRIPTION_ROUTE = "/subscription";
const TARGET_AUDIENCE_ROUTE = "/target-audiences";
const WALLET_ROUTE = "/wallet";

export const AUTH_ROUTES = {
  LOGIN: `${AUTH_ROUTE}/login`,
  REGISTER: `${AUTH_ROUTE}/register`,
  VERIFY_OTP: `${AUTH_ROUTE}/verify-otp`,
  RESEND_OTP: `${AUTH_ROUTE}/resend-otp`,
  FORGOT_PASSWORD: `${AUTH_ROUTE}/forgot-password`,
  RESET_PASSWORD: `${AUTH_ROUTE}/reset-password`,
  LOGOUT: `${AUTH_ROUTE}/logout`,
  GOOGLE: `${AUTH_ROUTE}/google`,
  GITHUB: `${AUTH_ROUTE}/github`,
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

// export const CHANNEL_ROUTES = {
//   CREATE_CHANNEL: `${CHANNEL_ROUTE}/create-channel`,
//   GET_USER_CHANNELS: `${CHANNEL_ROUTE}/get-user-channels`,
//   GET_CHANNEL_MESSAGES: `${CHANNEL_ROUTE}/get-channel-messages`,
// } as const;

export const SEARCH_ROUTES = {
  GLOBAL: SEARCH_ROUTE,
} as const;

export const TIME_SLOT_ROUTES = {
  BASE: `${MENTOR_ROUTE}/time-slot`,
  BY_DATE: `${MENTOR_ROUTE}/time-slot/by-date`,
  BOOKED: `${MENTOR_ROUTE}/time-slot/booked-time-slot`,
} as const;

export const BOOKING_PAYMENT_ROUTES = {
  CREATE_CHECKOUT_SESSION: `${BOOKING_PAYMENT_ROUTE}/create-booking-checkout-session`,
  VERIFY_SESSION: `${BOOKING_PAYMENT_ROUTE}/verify-booking-session`,
} as const;

export const BOOKING_ROUTES = {
  BASE: BOOKING_ROUTE,
  UPCOMING: `${BOOKING_ROUTE}/upcoming`,
  COMPLETED: `${BOOKING_ROUTE}/completed`,
  FILTER: `${BOOKING_ROUTE}/filter`,
} as const;

export const CHAT_ROUTES = {
  CHATS: `${CHAT_ROUTE}/chats`,
  GROUPS: `${CHAT_ROUTE}/groups`,
  MESSAGES: `${CHAT_ROUTE}/messages`,
} as const;

export const USER_ROUTES = {
  BASE: USER_ROUTE,
  UPDATE: `${USER_ROUTE}/update`,
  UPDATE_PASSWORD: `${USER_ROUTE}/update/password`,
  CONTENTS: `${USER_ROUTE}/contents`,
  CHECK_USERNAME: `${USER_ROUTE}/check-username`,
  SQUADS: `${USER_ROUTE}/squads`,
} as const;

export const SQUAD_ROUTES = {
  BASE: SQUAD_ROUTE,
  DETAIL: `${SQUAD_ROUTE}/detail`,
  JOINED: `${SQUAD_ROUTE}/joined`,
} as const;

export const ADMIN_ROUTES = {
  LOGIN: `${ADMIN_ROUTE}/login`,
  DASHBOARD: `${ADMIN_ROUTE}/dashboard`,
  CATEGORY: `${ADMIN_ROUTE}/category`,
  COMMENT: `${ADMIN_ROUTE}/comment`,
  CONTENT: `${ADMIN_ROUTE}/content`,
  SQUAD: `${ADMIN_ROUTE}/squad`,
  USER: `${ADMIN_ROUTE}/user`,
} as const;

export const FOLLOWER_ROUTES = {
  BASE: FOLLOWER_ROUTE,
  FOLLOW: `${FOLLOWER_ROUTE}/follow`,
  UNFOLLOW: `${FOLLOWER_ROUTE}/unfollow`,
  IS_FOLLOWING: `${FOLLOWER_ROUTE}/is-following`,
  CONNECT: `${FOLLOWER_ROUTE}/connect`,
  WITHDRAW: `${FOLLOWER_ROUTE}/withdraw`,
  ACCEPT: `${FOLLOWER_ROUTE}/accept`,
  REJECT: `${FOLLOWER_ROUTE}/reject`,
  REMOVE: `${FOLLOWER_ROUTE}/remove`,
  HAS_REQUESTED: `${FOLLOWER_ROUTE}/has-requested`,
  IS_CONNECTED: `${FOLLOWER_ROUTE}/is-connected`,
  CONNECTIONS: `${FOLLOWER_ROUTE}/connections`,
  PENDING: `${FOLLOWER_ROUTE}/pending`,
  GET_ALL_CONNECTIONS: `${FOLLOWER_ROUTE}/get-all-connections`,
  STATS: `${FOLLOWER_ROUTE}/stats`,
  SENT_REQUESTS: `${FOLLOWER_ROUTE}/sent-requests`,
} as const;

export const NOTIFICATION_ROUTES = {
  BASE: NOTIFICATION_ROUTE,
  READ_ALL: `${NOTIFICATION_ROUTE}/read-all`,
} as const;

export const NOTIFICATION_TYPE_ROUTES = {
  BASE: NOTIFICATION_TYPE_ROUTE,
} as const;

export const PAYMENT_ROUTES = {
  BASE: PAYMENT_ROUTE,
  CREATE_CHECKOUT_SESSION: `${PAYMENT_ROUTE}/create-checkout-session`,
  VERIFY_SESSION: `${PAYMENT_ROUTE}/verify-session`,
} as const;

export const PLAN_ROUTES = {
  BASE: PLAN_ROUTE,
} as const;

export const REVIEW_ROUTES = {
  BASE: REVIEW_ROUTE,
  MENTOR: `${REVIEW_ROUTE}/mentor`,
  USER_MY_REVIEWS: `${REVIEW_ROUTE}/user/my-reviews`,
  CHECK: `${REVIEW_ROUTE}/check`,
} as const;

export const MENTOR_METADATA_ROUTES = {
  BASE: MENTOR_METADATA_ROUTE,
  TYPE: `${MENTOR_METADATA_ROUTE}/type`,
} as const;

export const MENTORSHIP_TYPE_ROUTES = {
  BASE: MENTORSHIP_TYPE_ROUTE,
} as const;

export const SUBSCRIPTION_ROUTES = {
  CURRENT: `${SUBSCRIPTION_ROUTE}/current`,
} as const;

export const TARGET_AUDIENCE_ROUTES = {
  BASE: TARGET_AUDIENCE_ROUTE,
} as const;

export const WALLET_ROUTES = {
  BASE: WALLET_ROUTE,
  ADD: `${WALLET_ROUTE}/add`,
  WITHDRAW: `${WALLET_ROUTE}/withdraw`,
  POINTS: `${WALLET_ROUTE}/points`,
  REQUESTS: `${WALLET_ROUTE}/requests`,
  REQUESTS_USER: `${WALLET_ROUTE}/requests/user`,
  REQUESTS_APPROVE: `${WALLET_ROUTE}/requests/approve`,
  REQUESTS_REJECT: `${WALLET_ROUTE}/requests/reject`,
} as const;
