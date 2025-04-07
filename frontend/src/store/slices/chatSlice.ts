import { Chat, Group, Message } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  chats: Chat[];
  groups: Group[];
  messages: { [key: string]: Message[] }; // chatId -> messages
  pendingChat: { userId: string } | null;
  activeChat: { id: string; type: "Chat" | "Group" } | null;
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

    // setUnreadCount(
    //   state,
    //   action: PayloadAction<{ chatId: string; count: number }>,
    // ) {
    //   state.unreadCounts[action.payload.chatId] = action.payload.count;
    // },

    setActiveChat(
      state,
      action: PayloadAction<{ id: string; type: "Chat" | "Group" } | null>,
    ) {
      state.activeChat = action.payload;
    },

    setPendingChat(state, action: PayloadAction<{ userId: string }>) {
      state.pendingChat = action.payload;
      state.activeChat = null; // Clear active chat when setting a pending chat
    },
  },
});

export const {
  setChats,
  setGroups,
  setMessages,
  addMessage,
  updateMessage,
  // setUnreadCount,
  setActiveChat,
  setPendingChat,
} = chatSlice.actions;
export default chatSlice.reducer;
