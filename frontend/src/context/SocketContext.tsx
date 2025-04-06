import { SocketContext } from "@/hooks/useSocket";
import {
  addMessage,
  setChats,
  setGroups,
  setUnreadCount,
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

    socket.on("messagesRead", ({ chatId }) => {
      dispatch(setUnreadCount({ chatId, count: 0 }));
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
