import { Chat, Group, Message } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActiveChat {
  id: string;
  type: "Chat" | "Group";
  userDetails: {
    userId?: string;
    name: string;
    username?: string;
    profilePic?: string;
  };
}

interface ChatState {
  chats: Chat[];
  groups: Group[];
  messages: { [key: string]: Message[] }; // chatId -> messages
  pendingChat: {
    userId: string;
    userDetails: ActiveChat["userDetails"];
  } | null;
  activeChat: ActiveChat | null;
}

const initialState: ChatState = {
  chats: [],
  groups: [],
  messages: {},
  pendingChat: null,
  activeChat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
    },

    setGroups(state, action: PayloadAction<Group[]>) {
      state.groups = action.payload;
    },

    setMessages(
      state,
      action: PayloadAction<{ chatId: string; messages: Message[] }>,
    ) {
      state.messages[action.payload.chatId] = action.payload.messages;
    },

    addMessage(state, action: PayloadAction<Message>) {
      const chatId = action.payload.chatId;

      if (!state.messages[chatId]) state.messages[chatId] = [];

      state.messages[chatId].push(action.payload);
    },

    updateMessage(state, action: PayloadAction<Message>) {
      const chatId = action.payload.chatId;
      const index = state.messages[chatId]?.findIndex(
        (m) => m._id === action.payload._id,
      );
      if (index !== undefined && index >= 0) {
        state.messages[chatId][index] = action.payload;
      }
    },

    setUserUnreadCountToZero(
      state,
      action: PayloadAction<{
        chatId: string;
        userId: string;
        type: "Chat" | "Group";
      }>,
    ) {
      const { chatId, userId, type } = action.payload;
      const list = type === "Chat" ? state.chats : state.groups;

      const chat = list.find((c) => c._id === chatId);
      if (chat && chat.unreadCounts) {
        chat.unreadCounts = chat.unreadCounts.map((uc) =>
          uc.userId === userId ? { ...uc, count: 0 } : uc,
        );
      }
    },

    incrementUnreadCount(
      state,
      action: PayloadAction<{
        chatId: string;
        userId: string;
        type: "Chat" | "Group";
      }>,
    ) {
      const { chatId, userId, type } = action.payload;
      const list = type === "Chat" ? state.chats : state.groups;
      const chat = list.find((c) => c._id === chatId);
      if (chat && chat.unreadCounts) {
        const unreadCount = chat.unreadCounts.find(
          (uc) => uc.userId === userId,
        );
        if (unreadCount) {
          unreadCount.count += 1;
        } else {
          chat.unreadCounts.push({ userId, count: 1 });
        }
      }
    },

    updateLastMessage(
      state,
      action: PayloadAction<{
        chatId: string;
        type: "Chat" | "Group";
        lastMessage: Message;
      }>,
    ) {
      const { chatId, type, lastMessage } = action.payload;
      const list = type === "Chat" ? state.chats : state.groups;
      const chat = list.find((c) => c._id === chatId);
      if (chat) {
        chat.lastMessage = lastMessage;
      }
    },

    setActiveChat(state, action: PayloadAction<ActiveChat | null>) {
      state.activeChat = action.payload;
      if (action.payload) {
        state.pendingChat = null;
      }
    },

    setPendingChat(
      state,
      action: PayloadAction<{
        userId: string;
        userDetails: ActiveChat["userDetails"];
      }>,
    ) {
      state.pendingChat = {
        userId: action.payload.userId,
        userDetails: action.payload.userDetails,
      };
      state.activeChat = null;
    },
  },
});

export const {
  setChats,
  setGroups,
  setMessages,
  addMessage,
  updateMessage,
  incrementUnreadCount,
  setUserUnreadCountToZero,
  updateLastMessage,
  setActiveChat,
  setPendingChat,
} = chatSlice.actions;
export default chatSlice.reducer;
