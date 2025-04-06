import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket)
    throw new Error("useSocket must be used within a SocketProvider");
  return socket;
};

export { SocketContext };
