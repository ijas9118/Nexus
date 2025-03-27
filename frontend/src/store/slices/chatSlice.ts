import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
  selectedChatType: string | undefined;
  selectedChatData: any | undefined;
  selectedChatMessages: any[];
  directMessageChats: any[];
}

const initialState: ChatState = {
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessageChats: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChatType: (state, action: PayloadAction<string | undefined>) => {
      state.selectedChatType = action.payload;
    },
    setSelectedChatData: (state, action: PayloadAction<any | undefined>) => {
      state.selectedChatData = action.payload;
    },
    setSelectedChatMessages: (state, action: PayloadAction<any[]>) => {
      state.selectedChatMessages = action.payload;
    },
    setDirectMessageChats: (state, action: PayloadAction<any[]>) => {
      state.directMessageChats = action.payload;
    },
    closeChat: (state) => {
      state.selectedChatData = undefined;
      state.selectedChatType = undefined;
      state.selectedChatMessages = [];
    },
    addMessage: (state, action: PayloadAction<any>) => {
      const message = action.payload;
      const newMessage = {
        ...message,
        recipient:
          state.selectedChatType === "channel"
            ? message.recipient
            : message.recipient._id,
        sender:
          state.selectedChatType === "channel"
            ? message.sender
            : message.sender._id,
      };
      state.selectedChatMessages = [...state.selectedChatMessages, newMessage];
    },
  },
});

export const {
  setSelectedChatType,
  setSelectedChatData,
  setSelectedChatMessages,
  setDirectMessageChats,
  closeChat,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
