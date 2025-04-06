import { Chat, Group, Message } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  chats: Chat[];
  groups: Group[];
  messages: { [key: string]: Message[] }; // chatId -> messages
  unreadCounts: { [key: string]: number }; // chatId -> unread count
  activeChat: { id: string; type: "Chat" | "Group" } | null;
}

const initialState: ChatState = {
  chats: [],
  groups: [],
  messages: {},
  unreadCounts: {},
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

      if (state.activeChat?.id !== chatId) {
        state.unreadCounts[chatId] = (state.unreadCounts[chatId] || 0) + 1;
      }
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

    setUnreadCount(
      state,
      action: PayloadAction<{ chatId: string; count: number }>,
    ) {
      state.unreadCounts[action.payload.chatId] = action.payload.count;
    },

    setActiveChat(
      state,
      action: PayloadAction<{ id: string; type: "Chat" | "Group" } | null>,
    ) {
      state.activeChat = action.payload;
      if (action.payload) {
        state.unreadCounts[action.payload.id] = 0; // Reset unread count when chat is opened
      }
    },
  },
});

export const {
  setChats,
  setGroups,
  setMessages,
  addMessage,
  updateMessage,
  setUnreadCount,
  setActiveChat,
} = chatSlice.actions;
export default chatSlice.reducer;
