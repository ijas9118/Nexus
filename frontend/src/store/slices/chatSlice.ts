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

      if (state.selectedChatType === "connection") {
        const chatIndex = state.directMessageChats.findIndex(
          (chat) =>
            chat._id === message.recipient._id ||
            chat._id === message.sender._id,
        );
        if (chatIndex !== -1) {
          state.directMessageChats[chatIndex] = {
            ...state.directMessageChats[chatIndex],
            lastMessageContent: message.content || "File sent",
            lastMessageTime: message.createdAt || new Date().toISOString(),
          };
        }
      } else if (state.selectedChatType === "channel") {
        const channelIndex = state.channels.findIndex(
          (channel) => channel._id === message.channelId,
        );
        if (channelIndex !== -1) {
          state.channels[channelIndex] = {
            ...state.channels[channelIndex],
            lastMessageContent: message.content || "File sent",
            lastMessageTime: message.createdAt || new Date().toISOString(),
          };
        }
      }
    },
    addChannel: (state, action: PayloadAction<any>) => {
      const channel = action.payload;
      state.channels = [channel, ...state.channels];
    },
    addChannelInChannelList: (state, action: PayloadAction<any>) => {
      const message = action.payload;
      const channels = state.channels;
      const index = channels.findIndex(
        (channel) => channel._id === message.channelId,
      );

      const data = channels.find(
        (channel) => channel._id === message.channelId,
      );

      if (index !== -1 && data) {
        state.channels.splice(index, 1);
        state.channels.unshift(data);
      }
    },
    addConnectionsInDMList: (
      state,
      action: PayloadAction<{ message: any; userId: string }>,
    ) => {
      const { message, userId } = action.payload;
      const fromId =
        message.sender._id === userId
          ? message.recipient._id
          : message.sender._id;
      const fromData =
        message.sender._id === userId ? message.recipient : message.sender;

      const index = state.directMessageChats.findIndex(
        (contact) => contact._id === fromId,
      );

      if (index !== -1) {
        const [existingContact] = state.directMessageChats.splice(index, 1);
        state.directMessageChats.unshift(existingContact);
      } else {
        state.directMessageChats.unshift(fromData);
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
  addConnectionsInDMList,
} = chatSlice.actions;

export default chatSlice.reducer;
