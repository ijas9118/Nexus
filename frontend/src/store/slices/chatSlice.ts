import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
  selectedChatType: string | undefined;
  selectedChatData: any | undefined;
  selectedChatMessages: any[];
}

const initialState: ChatState = {
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
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
    closeChat: (state) => {
      state.selectedChatData = undefined;
      state.selectedChatType = undefined;
      state.selectedChatMessages = [];
    },
  },
});

export const {
  setSelectedChatType,
  setSelectedChatData,
  setSelectedChatMessages,
  closeChat,
} = chatSlice.actions;

export default chatSlice.reducer;
