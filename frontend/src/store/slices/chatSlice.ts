import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
  selectedChatType: string | undefined;
  selectedChatData: any | undefined;
  selectedChatMessages: any[];
  directMessageChats: any[];
  channels: any[];
}

const initialState: ChatState = {
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessageChats: [],
  channels: [],
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
    setChannels: (state, action: PayloadAction<any[]>) => {
      state.channels = action.payload;
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
    addChannel: (state, action: PayloadAction<any>) => {
      const channel = action.payload;
      state.channels = [channel, ...state.channels];
    },
    addChannelInChannelList: (state, action: PayloadAction<any>) => {
      const message = action.payload;
      const channels = state.channels;
      const data = channels.find(
        (channel) => channel._id === message.channelId,
      );
      const index = channels.findIndex(
        (channel) => channel._id === message.channelId,
      );

      if (index === -1 || index === undefined) {
        state.channels.splice(index, 1);
        state.channels.unshift(data);
      }
    },
  },
});

export const {
  setSelectedChatType,
  setSelectedChatData,
  setSelectedChatMessages,
  setDirectMessageChats,
  setChannels,
  closeChat,
  addMessage,
  addChannel,
  addChannelInChannelList,
} = chatSlice.actions;

export default chatSlice.reducer;
