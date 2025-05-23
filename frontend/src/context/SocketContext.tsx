import { SocketContext } from "@/hooks/useSocket";
import {
  addMessage,
  incrementUnreadCount,
  setChats,
  setGroups,
  setUserUnreadCountToZero,
  updateLastMessage,
  updateMessage,
} from "@/store/slices/chatSlice";
import store, { RootState } from "@/store/store";
import { HOST } from "@/utils/constants";
import { ReactNode, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeChat } = useSelector((state: RootState) => state.chat);

  const socket = useMemo(() => {
    if (!user?._id) {
      console.log("No user ID available, socket not created");
      return null;
    }
    console.log("Creating socket for user:", user._id);
    return io(HOST, {
      withCredentials: true,
      query: { userId: user._id },
    });
  }, [user?._id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("chatCreated", (chat) => {
      dispatch(setChats([...(store.getState().chat.chats || []), chat]));
    });

    socket.on("groupCreated", (group) => {
      dispatch(setGroups([...(store.getState().chat.groups || []), group]));
    });

    socket.on("newMessage", (message) => {
      dispatch(addMessage(message));

      dispatch(
        updateLastMessage({
          chatId: message.chatId,
          type: message.chatType,
          lastMessage: message,
        }),
      );

      const userId = user?._id;
      const isActiveChat =
        activeChat &&
        activeChat.id === message.chatId &&
        activeChat.type === message.chatType;

      if (userId && message.sender !== userId && !isActiveChat) {
        dispatch(
          incrementUnreadCount({
            chatId: message.chatId,
            userId,
            type: message.chatType,
          }),
        );
      }
    });

    socket.on("messageReaction", (message) => {
      dispatch(updateMessage(message));
    });

    socket.on("reactionRemoved", (message) => {
      dispatch(updateMessage(message));
    });

    socket.on("messageDeleted", (message) => {
      dispatch(updateMessage(message));
    });

    socket.on("messagesRead", ({ chatId, userId, chatType }) => {
      dispatch(setUserUnreadCountToZero({ chatId, userId, type: chatType }));
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, [socket, dispatch]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
