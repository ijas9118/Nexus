import { RootState } from "@/store/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { ReactNode } from "react";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  console.log(socket);
  return socket;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const socket = useMemo(() => {
    if (!user?._id) {
      console.log("No user ID available, socket not created");
      return null;
    }
    console.log("Creating socket for user:", user._id);
    const socketInstance = io(HOST, {
      withCredentials: true,
      query: { userId: user._id },
    });

    return socketInstance;
  }, [user?._id]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
